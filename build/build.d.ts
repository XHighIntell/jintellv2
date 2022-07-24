declare namespace build {

    /** Read content of file into string */
    export function readAllFilesText(src: string | string[]): string;

    export function build(job: JavaScriptBuildJob, switches: BuildArgumentsObject["switches"]): void;
    export function buildJavaScript(job: JavaScriptBuildJob, switches: BuildArgumentsObject["switches"]): void;
    export function buildDeclarationTypescript(job: DeclarationTypescriptBuildJob, switches: BuildArgumentsObject["switches"]): void;
    export function buildStyleSheet(job: StyleSheetBuildJob, switches: BuildArgumentsObject["switches"]): void;


    interface BuildArgumentsObject {
        /** All parameters after split space. The parameters are not parsed by anything. */
        parameters: string[];

        /** Only commands. */
        commands: string[];

        /** Only switches. */
        switches: {
            mode: 'development' | 'production';
            input: 'src';
            output: 'output/development';
            [T: string]: string | boolean
        };
    }


    interface JavaScriptBuildJob {
        type: 'javascript',
        name: string,
        src: ['intell.js', 'intell.controls.js']
        dest: {
            name: 'intell.js',
            minify: 'intell.min.js',
            sourcemap: 'intell.min.js.map',
        }
    }
    interface DeclarationTypescriptBuildJob {
        type: 'declaration typescript',
        name: string,
        src: ['intell.d.ts', 'intell.controls.d.ts']
        dest: {
            name: 'intell.d.ts'
        }
    }
    interface StyleSheetBuildJob {
        type: 'style sheet',
        name: string,
        src: ['portal.css']
        dest: {
            name: 'portal.css',
        }
    }

    type BuildJob = JavaScriptBuildJob | DeclarationTypescriptBuildJob | StyleSheetBuildJob;
}






