declare namespace build {

    /** Read content of file into string */
    export function readAllFilesText(src: string | string[]): string;

    export function build(job: BuildJob, switches: BuildSwitches): void;
    export function buildJavaScript(job: JavaScriptBuildJob, switches: BuildSwitches): void;
    export function buildDeclarationTypescript(job: DeclarationTypescriptBuildJob, BuildSwitches): void;
    export function buildStyleSheet(job: StyleSheetBuildJob, switches: BuildSwitches): void;

    /** Create github release. */
    export function release(switches: ReleaseSwitches): void;

    interface BuildArgumentsObject {
        /** All parameters after split space. The parameters are not parsed by anything. */
        parameters: string[];

        /** Only commands. */
        commands: string[];

        /** Only switches. */
        switches: BuildSwitches | ReleaseSwitches;
    }

    interface BuildSwitches {
        action: 'build';
        mode: 'development' | 'production';
        input: 'src';
        output: 'output/development';
    }
    interface ReleaseSwitches {
        action: 'release';
        input: '../output/production/*';
        version: 'v1.2.3';
        token: string;
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






