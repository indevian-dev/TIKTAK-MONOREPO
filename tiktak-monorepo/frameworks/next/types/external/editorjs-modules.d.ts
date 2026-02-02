// Type declarations for EditorJS modules without official types

declare module '@editorjs/link' {
  import {BlockTool, BlockToolData} from '@editorjs/editorjs';
  
  export interface LinkToolData extends BlockToolData {
    link: string;
    meta?: {
      title?: string;
      description?: string;
      image?: {
        url: string;
      };
    };
  }

  export default class LinkTool implements BlockTool {
    constructor({data, config, api, readOnly}: any);
    static get toolbox(): {
      icon: string;
      title: string;
    };
    render(): HTMLElement;
    save(blockContent: HTMLElement): LinkToolData;
  }
}

declare module '@editorjs/simple-image' {
  import {BlockTool, BlockToolData} from '@editorjs/editorjs';
  
  export interface SimpleImageData extends BlockToolData {
    url: string;
    caption?: string;
    withBorder?: boolean;
    withBackground?: boolean;
    stretched?: boolean;
  }

  export default class SimpleImage implements BlockTool {
    constructor({data, config, api, readOnly}: any);
    static get toolbox(): {
      icon: string;
      title: string;
    };
    render(): HTMLElement;
    save(blockContent: HTMLElement): SimpleImageData;
  }
}

declare module '@editorjs/embed' {
  import {BlockTool, BlockToolData} from '@editorjs/editorjs';
  
  export interface EmbedData extends BlockToolData {
    service: string;
    source: string;
    embed: string;
    width?: number;
    height?: number;
    caption?: string;
  }

  export default class Embed implements BlockTool {
    constructor({data, config, api, readOnly}: any);
    static get toolbox(): {
      icon: string;
      title: string;
    };
    render(): HTMLElement;
    save(blockContent: HTMLElement): EmbedData;
  }
}

declare module '@editorjs/checklist' {
  import {BlockTool, BlockToolData} from '@editorjs/editorjs';
  
  export interface ChecklistData extends BlockToolData {
    items: Array<{
      text: string;
      checked: boolean;
    }>;
  }

  export default class Checklist implements BlockTool {
    constructor({data, config, api, readOnly}: any);
    static get toolbox(): {
      icon: string;
      title: string;
    };
    render(): HTMLElement;
    save(blockContent: HTMLElement): ChecklistData;
  }
}

declare module '@editorjs/raw' {
  import {BlockTool, BlockToolData} from '@editorjs/editorjs';
  
  export interface RawData extends BlockToolData {
    html: string;
  }

  export default class RawTool implements BlockTool {
    constructor({data, config, api, readOnly}: any);
    static get toolbox(): {
      icon: string;
      title: string;
    };
    render(): HTMLElement;
    save(blockContent: HTMLElement): RawData;
  }
}



