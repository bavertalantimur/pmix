#!/usr/bin/env python3
"""Generate sitemap.xml and robots.txt for pmgix."""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT / "seo" / "site-config.json"
TODAY = date.today().isoformat()

PRIORITY = {
    "index.html": "1.0",
    "pages/services.html": "0.9",
    "pages/industries.html": "0.9",
    "pages/insights.html": "0.9",
    "pages/academy.html": "0.9",
    "pages/careers.html": "0.8",
    "pages/contact.html": "0.8",
    "pages/about.html": "0.8",
    "pages/company-overview.html": "0.8",
    "pages/location.html": "0.7",
    "pages/submit-rfp.html": "0.7",
}


def load_config() -> dict:
    with CONFIG_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


def page_loc(site_url: str, rel_path: str) -> str:
    if rel_path == "index.html":
        return f"{site_url.rstrip('/')}/"
    return f"{site_url.rstrip('/')}/{rel_path}"


def build_sitemap(config: dict) -> str:
    site_url = config["siteUrl"]
    urlset = ET.Element(
        "urlset",
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9",
    )

    html_files = sorted(ROOT.glob("**/*.html"))
    html_files = [path for path in html_files if "components" not in path.parts]

    for path in html_files:
        rel_path = path.relative_to(ROOT).as_posix()
        url = ET.SubElement(urlset, "url")
        ET.SubElement(url, "loc").text = page_loc(site_url, rel_path)
        ET.SubElement(url, "lastmod").text = TODAY
        ET.SubElement(url, "changefreq").text = "monthly"
        ET.SubElement(url, "priority").text = PRIORITY.get(rel_path, "0.6")

    ET.indent(urlset, space="  ")
    xml_body = ET.tostring(urlset, encoding="unicode")
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_body + "\n"


def build_robots(config: dict) -> str:
    site_url = config["siteUrl"].rstrip("/")
    return (
        "# pmgix robots.txt\n"
        "User-agent: *\n"
        "Allow: /\n"
        "\n"
        "Disallow: /components/\n"
        "Disallow: /scripts/\n"
        "Disallow: /seo/\n"
        "\n"
        f"Sitemap: {site_url}/sitemap.xml\n"
    )


def main() -> None:
    config = load_config()
    (ROOT / "sitemap.xml").write_text(build_sitemap(config), encoding="utf-8", newline="\n")
    (ROOT / "robots.txt").write_text(build_robots(config), encoding="utf-8", newline="\n")
    print("Generated sitemap.xml and robots.txt")


if __name__ == "__main__":
    main()
