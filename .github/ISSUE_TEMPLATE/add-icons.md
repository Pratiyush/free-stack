---
name: Add Icons
about: Add Lucide icons to service entries in a category
title: "icons: add Lucide icons to [CATEGORY]"
labels: add-icons, good first issue, help wanted
assignees: ''
---

## Category

**Category file:** `categories/[FILENAME].md`

## What Needs to Be Done

Add [Lucide icons](https://lucide.dev) to each service entry in this category where a matching icon exists.

- [ ] Check each service name against Lucide icon library
- [ ] Add matching icons to the service name column
- [ ] Use the closest relevant icon if exact match doesn't exist
- [ ] Skip services with no reasonable icon match

## Icon Reference

Browse all icons at: https://lucide.dev/icons

## Guidelines

- Use the icon name, not the SVG — we reference by name
- Prefer exact matches over approximate ones
- Don't force icons — skip if no good match exists
- Branch: `icons/[category-name]`
- PR title: `icons: add Lucide icons to [category]`
