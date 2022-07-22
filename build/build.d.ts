

declare namespace build {

    export function get(): void;






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

    type BuildJob = {
        type: 'javascript',
        name: string,
        src: ['intell.js', 'intell.controls.js']
        dest: {
            name: 'intell.js',
            minify: 'intell.min.js',
            sourcemap: 'intell.min.js.map',
        }
    } | {
        type: 'declaration typescript',
        name: string,
        src: ['intell.d.ts', 'intell.controls.d.ts']
        dest: {
            name: 'intell.d.ts',
            minify: 'intell.min.d.ts',
        }
    } | {
        type: 'style sheet',
        name: string,
        src: ['portal.css']
        dest: {
            name: 'portal.css',
            minify: 'portal.min.css',
        }
    };
}






