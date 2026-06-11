#!/usr/bin/env python3
"""Inject complete SEO meta tags into all pmgix HTML pages."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "seo" / "site-config.json"


def load_config() -> dict:
    with CONFIG_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def extract_meta(content: str, name: str) -> str:
    pattern = rf'<meta\s+(?:name|property)="{re.escape(name)}"\s+content="([^"]*)"'
    match = re.search(pattern, content, re.IGNORECASE)
    return match.group(1) if match else ""


def extract_title(content: str) -> str:
    match = re.search(r"<title>([^<]*)</title>", content, re.IGNORECASE)
    return match.group(1).strip() if match else ""


def page_path_key(path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    return rel


def canonical_url(site_url: str, rel_path: str) -> str:
    if rel_path == "index.html":
        return f"{site_url.rstrip('/')}/"
    return f"{site_url.rstrip('/')}/{rel_path}"


def asset_prefix(rel_path: str) -> str:
    return "../" if rel_path.startswith("pages/") else ""


def json_ld_block(config: dict, rel_path: str, title: str, description: str, canonical: str) -> str:
    org = config["organization"]
    org_schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": org["name"],
        "url": config["siteUrl"],
        "logo": f"{config['siteUrl'].rstrip('/')}/assets/images/background-removed.svg",
        "description": org["description"],
        "email": org["email"],
        "telephone": org["telephone"],
        "address": {
            "@type": "PostalAddress",
            **org["address"],
        },
    }
    if org.get("sameAs"):
        org_schema["sameAs"] = org["sameAs"]

    blocks = [org_schema]

    if rel_path == "index.html":
        blocks.append(
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": config["siteName"],
                "url": config["siteUrl"],
                "description": description,
                "publisher": {"@type": "Organization", "name": org["name"]},
            }
        )
    if rel_path != "index.html":
        blocks.append(
            {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": title,
                "description": description,
                "url": canonical,
                "isPartOf": {"@type": "WebSite", "name": config["siteName"], "url": config["siteUrl"]},
            }
        )

    if rel_path == "pages/location.html":
        blocks.append(
            {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": org["name"],
                "url": canonical,
                "image": f"{config['siteUrl'].rstrip('/')}/assets/images/background-removed.svg",
                "email": org["email"],
                "telephone": org["telephone"],
                "address": {
                    "@type": "PostalAddress",
                    **org["address"],
                },
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                        ],
                        "opens": "09:00",
                        "closes": "18:00",
                    }
                ],
            }
        )

    return "\n".join(
        f'  <script type="application/ld+json">{json.dumps(block, ensure_ascii=False)}</script>'
        for block in blocks
    )


def build_seo_head(
    config: dict,
    rel_path: str,
    title: str,
    description: str,
    include_preconnect: bool,
) -> str:
    site_url = config["siteUrl"].rstrip("/")
    prefix = asset_prefix(rel_path)
    canonical = canonical_url(site_url, rel_path)
    og_image = f"{site_url}{config['ogImage']}"
    favicon = f"{prefix}assets/images/background-removed.svg"

    lines = [
        "<head>",
        "  <meta charset=\"UTF-8\">",
        "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
        "",
        f"  <title>{title}</title>",
        f"  <meta name=\"description\" content=\"{description}\">",
        "  <meta name=\"robots\" content=\"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1\">",
        f"  <meta name=\"author\" content=\"{config['author']}\">",
        f"  <meta name=\"theme-color\" content=\"{config['themeColor']}\">",
        f"  <link rel=\"canonical\" href=\"{canonical}\">",
        "",
        "  <meta property=\"og:type\" content=\"website\">",
        f"  <meta property=\"og:site_name\" content=\"{config['siteName']}\">",
        f"  <meta property=\"og:locale\" content=\"{config['defaultLocale']}\">",
        f"  <meta property=\"og:title\" content=\"{title}\">",
        f"  <meta property=\"og:description\" content=\"{description}\">",
        f"  <meta property=\"og:url\" content=\"{canonical}\">",
        f"  <meta property=\"og:image\" content=\"{og_image}\">",
        f"  <meta property=\"og:image:alt\" content=\"{config['ogImageAlt']}\">",
        f"  <meta property=\"og:image:width\" content=\"{config['ogImageWidth']}\">",
        f"  <meta property=\"og:image:height\" content=\"{config['ogImageHeight']}\">",
        "",
        "  <meta name=\"twitter:card\" content=\"summary_large_image\">",
        f"  <meta name=\"twitter:site\" content=\"{config['twitterHandle']}\">",
        f"  <meta name=\"twitter:title\" content=\"{title}\">",
        f"  <meta name=\"twitter:description\" content=\"{description}\">",
        f"  <meta name=\"twitter:image\" content=\"{og_image}\">",
        f"  <meta name=\"twitter:image:alt\" content=\"{config['ogImageAlt']}\">",
        "",
        f"  <link rel=\"icon\" href=\"{favicon}\" type=\"image/svg+xml\">",
        f"  <link rel=\"apple-touch-icon\" href=\"{favicon}\">",
        "",
        json_ld_block(config, rel_path, title, description, canonical),
    ]

    if include_preconnect:
        lines.extend(
            [
                "",
                "  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">",
                "  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>",
            ]
        )

    return "\n".join(lines)


def replace_head(content: str, new_head_start: str) -> str:
    stylesheet_match = re.search(r"\n\s*<link rel=\"stylesheet\"", content)
    if not stylesheet_match:
        raise ValueError("Could not find stylesheet links in HTML")

    tail = content[stylesheet_match.start() :]
    closing = re.search(r"</head>", tail)
    if not closing:
        raise ValueError("Could not find </head>")

    return content[: content.index("<head>")] + new_head_start + tail


def resolve_page_meta(content: str, rel_path: str, overrides: dict) -> tuple[str, str]:
    override = overrides.get(rel_path, {})
    title = override.get("title") or extract_title(content) or extract_meta(content, "og:title")
    description = (
        override.get("description")
        or extract_meta(content, "description")
        or extract_meta(content, "og:description")
    )

    if not title:
        slug = Path(rel_path).stem.replace("-", " ").title()
        title = f"{slug} | pmgix"

    if not description:
        description = (
            "Strategic financial advisory for complex projects, transactions, "
            "and long-term value creation."
        )

    return title, description


def process_file(path: Path, config: dict) -> None:
    rel_path = page_path_key(path)
    content = path.read_text(encoding="utf-8")
    title, description = resolve_page_meta(content, rel_path, config.get("pageOverrides", {}))
    include_preconnect = "fonts.googleapis.com" in content
    new_head = build_seo_head(config, rel_path, title, description, include_preconnect)
    updated = replace_head(content, new_head)
    path.write_text(updated, encoding="utf-8", newline="\n")
    print(f"Updated: {rel_path}")


def main() -> None:
    config = load_config()
    html_files = sorted(ROOT.glob("**/*.html"))
    html_files = [path for path in html_files if "components" not in path.parts]

    for path in html_files:
        process_file(path, config)


if __name__ == "__main__":
    main()
