# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- make the `baseUrl` and `publicDir` option optional and prepare default values for them

## 0.9.0 - 2024-11-06
### Added
- the `title` attribute to the container tags
  - This could be used as an alt text or the likes

## 0.9.0-beta.0 - 2024-11-06
### Added
- the `width` attribute to `video` tags
  - The value is "100%"
- the `.ogg` video format compatibility
- the `fallbackContent` option
  - Now users can optionally add arbitrary content in the `hast` way

## 0.8.0-beta.0 - 2024-11-06
### Added
- add the `data-remark-video-figure` attribute to the container tags

## 0.7.0-beta.0 - 2024-11-05
### Added
- add the `videoContainerTag` option

## 0.6.3-beta.0 - 2024-11-05
### Changed
- remove `bun`
- replace `bun` with `node:url` as an import source of `fileURLToPath`

## 0.6.2-beta.0 - 2024-11-05
### Changed
- Add `bun` to dependencies
  - A "bun not imported" error occurred without it

## 0.6.1-beta.0 - 2024-11-05
### Added
- Beta version (There might be some bugs and errors)
