import { Menu, TFile } from "obsidian";
import { IOSMDOptions, OpenSheetMusicDisplay } from "opensheetmusicdisplay";

import SheetMusicPlugin from 'main';
import { SheetMusicPluginComponent } from "component";
import { Embed } from "typings";


export class OpenSheetMusicDisplayEmbed extends SheetMusicPluginComponent implements Embed {
    containerEl: HTMLElement;
    file: TFile;
    osmd: OpenSheetMusicDisplay;
    options?: IOSMDOptions;

    constructor(plugin: SheetMusicPlugin, containerEl: HTMLElement, file: TFile, subpath: string) {
        super(plugin);
        this.containerEl = containerEl;
        this.containerEl.addClasses(["musicxml-embed", "osmd"]);
        this.file = file;

        // Rendering options
        if (subpath && subpath.startsWith("#")) {
            this.options = {};
            const params = new URLSearchParams(subpath.slice(1));

            if (params.has("bar")) {
                const value = params.get("bar")!;
                // "#bar=5" -> draw measure 5 only
                if (value.match(/^\d+$/)) {
                    this.options.drawFromMeasureNumber = this.options.drawUpToMeasureNumber = +value;
                } else {
                    // "#bar=5-10" -> draw measures 5 to 10
                    // "#bar=-10" -> draw from the beginning to measure 10
                    // "#bar=5-" -> draw from measure 5 to the end
                    const match = value.match(/^(\d*)-(\d*)$/);
                    if (match) {
                        match[1] && (this.options.drawFromMeasureNumber = +match[1]);
                        match[2] && (this.options.drawUpToMeasureNumber = +match[2]);
                    }
                }
            }
            if (params.has("credits")) {
                const value = params.get("credits")!;
                this.options.drawCredits = value && value !== "true" ? false : true;
            }
            if (params.has("nocredits")) {
                const value = params.get("nocredits")!;
                this.options.drawCredits = !value || value !== "false" ? false : true; 
            }
        }

        this.osmd = new OpenSheetMusicDisplay(this.containerEl, this.options);

        // Debugging utility
        this.containerEl.addEventListener("contextmenu", (evt) => {
            new Menu()
                .addItem((item) => {
                    item.setTitle("Expose \"osmd\" variable to console")
                        .onClick(() => {
                            // @ts-ignore
                            window.osmd = this.osmd;
                        })
                })
                .showAtMouseEvent(evt);
        });
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
        } else {
            await this.loadUncompressedMusicXml();
        }

        this.osmd.render();
    }

    async loadUncompressedMusicXml() {
        const content = await this.app.vault.read(this.file);
        await this.osmd.load(content);
    }

    async loadCompressedMusicXml() {
        const buffer = await this.app.vault.readBinary(this.file)
        const blob = new Blob([buffer], { type: "application/vnd.recordare.musicxml" });

        return new Promise<void>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                await this.osmd.load(reader.result as string);
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
