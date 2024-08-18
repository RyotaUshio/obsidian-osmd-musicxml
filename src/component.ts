import SheetMusicPlugin from 'main';
import { Component } from 'obsidian';


export class SheetMusicPluginComponent extends Component {
    constructor(public plugin: SheetMusicPlugin) {
        super();
    }

    get app() {
        return this.plugin.app;
    }

    get settings() {
        return this.plugin.settings;
    }
}
