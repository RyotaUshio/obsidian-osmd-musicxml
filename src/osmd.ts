import { TFile } from "obsidian";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

import SheetMusicPlugin from 'main';
import { SheetMusicPluginComponent } from "component";
import { Embed } from "typings";


export class OpenSheetMusicDisplayEmbed extends SheetMusicPluginComponent implements Embed {
    containerEl: HTMLElement;
    file: TFile;
    osmd: OpenSheetMusicDisplay;

    constructor(plugin: SheetMusicPlugin, containerEl: HTMLElement, file: TFile) {
        super(plugin);
        this.containerEl = containerEl;
        this.file = file;
        this.osmd = new OpenSheetMusicDisplay(this.containerEl);
    }

    onload() {
        super.onload();
        this.registerEvent(this.app.vault.on("modify", (file) => {
            if (file === this.file) {
                this.loadFile();
            }
        }));
    }

    async loadFile() {
        if (this.file.extension === "mxl") {
            await this.loadCompressedMusicXml();
            return;
        }

        await this.loadUncompressedMusicXml();
    }

    async loadUncompressedMusicXml() {
        const content = await this.app.vault.read(this.file);
        await this.osmd.load(content);
        this.osmd.render();
    }

    async loadCompressedMusicXml() {
        const buffer = await this.app.vault.readBinary(this.file)
        const blob = new Blob([buffer], { type: "application/vnd.recordare.musicxml" });

        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                await this.osmd.load(reader.result as string);
                this.osmd.render();
                resolve();
            };
            reader.onerror = reject;
            // readAsBinaryString is deprecated, but OSMD's official demo used it for mxl files
            // (https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/blob/7f5b7254635efaedef2cf073958f73772b057932/demo/index.js#L1019),
            // and I'm not aware of any other way to read them as strings that the `load` method expects.
            reader.readAsBinaryString(blob);
        });
    }
}
