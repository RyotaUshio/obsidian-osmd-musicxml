# OSMD MusicXML Viewer for Obsidian

This is an [Obsidian.md](https://obsidian.md) plugin for **rendering sheet music in the [MusicXML](https://www.musicxml.com/) format**. It is based on an open-source library called [OpenSheetMusicDisplay (OSMD)](https://github.com/opensheetmusicdisplay/opensheetmusicdisplay).

MusicXML is a well-established file format for exchanging sheet music and it is supported by many popular music notation application such as [MuseScore](https://musescore.org), [Dorico](https://www.steinberg.net/dorico/), [Sibelius](https://www.avid.com/sibelius), and [Finale](https://www.finalemusic.com/).
This plugin supports both uncompressed (.musicxml) and compressed (.mxl) formats.

## Features

This plugin allows you to embed MusicXML files in the standard `![[filename]]` (or `![](filename)`) notation.
You will not break a link even if you rename the target file because the link will be auto-updated (you need to allow Obsidian to do so in _Settings > Files and links > Automatically update internal links_).

### What is planned, but not implemented yet

- Standalone view (not just embeds)
- Audio playback (awaiting for the OSMD library to make this feature open-source; if you need this feature soon, please consider being a monthly GitHub sponsor for me so that I can pay for it. See [here](https://github.com/sponsors/opensheetmusicdisplay) for the details.)

### What will not be implemented

- Editing feature: it will be always better to use a dedicated application.

## Support development

If you find my plugins useful, please support my work to ensure they continue to work!

<a href="https://github.com/sponsors/RyotaUshio" target="_blank"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="GitHub Sponsors" style="width: 180px; height:auto;"></a>

<a href="https://www.buymeacoffee.com/ryotaushio" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="width: 180px; height:auto;"></a>

<a href='https://ko-fi.com/E1E6U7CJZ' target='_blank'><img height='36' style='border:0px; width: 180px; height:auto;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
