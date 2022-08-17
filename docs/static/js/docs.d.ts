declare namespace docs {

    export function generateArticle(article: Article): Promise<HTMLElement>;
    export function generateArticleField(article: ArticleField): Promise<HTMLElement>;

    export function generateGroupConstructors(items: ItemConstructor[]): HTMLElement;
    export function generateGroupFields(items: ItemField[]): HTMLElement;
    export function generateGroupProperties(items: ItemProperty[]): HTMLElement;
    export function generateGroupEvents(items: ItemEvent[]): HTMLElement;
    export function generateGroupMethods(items: ItemMethod[]): HTMLElement;
    export function generateGroupOverloads(items: ItemMethodOverload[]): HTMLElement;

    export function generateItemConstructor(item: ItemConstructor): HTMLElement;
    export function generateItemField(item: ItemField): HTMLElement;
    export function generateItemProperty(item: ItemProperty): HTMLElement;
    export function generateItemEvent(item: ItemEvent): HTMLElement;
    export function generateItemMethod(item: ItemMethod): HTMLElement;
    export function generateItemOverload(item: ItemMethodOverload): HTMLElement;


    export function _generateParameters(parameters: ItemMethodOverloadParameter[]): HTMLElement;
    export function _generateReturns(returns: ItemMethodOverloadReturns | string): HTMLElement;
    export function _generateRemarks(remarks: string): HTMLElement;
    export function _generateExamples(examples: string): Promise<HTMLElement>;

    export function _generatePropertyValue(value: ItemPropertyValue): HTMLElement;


    interface ArticleClass {
        _: 'class';
        title: string;
        description: string;
        constructors: ItemConstructor[];
        fields: ItemField[];
        properties: ItemProperty[];
        events: ItemEvent[];
        methods: ItemMethod[];
        remarks: string;
        examples: string;
    }
    interface ArticleFunction {
        _: 'function';
        title: string;
        description: string;
        overloads: ItemMethodOverload[]
        remarks: string;
        examples: string;
    }
    interface ArticleField {
        _: 'field';
        title: string;
        description: string;
        type: string;
        examples: string;
    }
    type Article = ArticleClass | ArticleFunction | ArticleField;
    

    interface ItemConstructor {
        title: 'constructor(element: HTMLElement)';
        description: '';
        parameters: ItemMethodOverloadParameter[]
        remarks: '<p><mark>CanRead</mark></p>'
    }
    interface ItemField {
        title: 'applications: Application[]';
        type: string;
        href: string;
        description: '';
        remarks: string;
    }

    interface ItemProperty {
        title: 'applications: Application[]';
        type: string;
        href: string;
        description: '';
        
        value: ItemPropertyValue;
        remarks: string;
    }
    interface ItemPropertyValue {
        type: string;
        href: string;
        description: string;
    }

    interface ItemEvent {
        title: 'onChange: EventRegister<(this: Portal, event: { oldApplication: Application, newApplication: Application }) => void>';
        description: '';
        remarks: string;
    }
    interface ItemMethod {
        title: 'constructor(element: HTMLElement)';
        description: '';

        overloads: ItemMethodOverload[];
        remarks: '<p><mark>CanRead</mark></p>'
    }
    interface ItemMethodOverload {
        title: 'open(application: Application):void';
        description: '';
        parameters: ItemMethodOverloadParameter[]
        returns: ItemMethodOverloadReturns;
        remarks: '<p><mark>CanRead</mark></p>'
    }
    type ItemMember = ItemConstructor | ItemProperty | ItemEvent | ItemMethod | ItemMethodOverload;

    interface ItemMethodOverloadParameter {
        name: 'application';
        type: 'Application[]';
        href: 'https://google.com/';
        description: string;
    }
    interface ItemMethodOverloadReturns {
        type: string;
        href: string;
        description: string;
    }
    
}


declare namespace docs.ui {

    export function _getArticleElement(id: string): Promise<HTMLElement>;
    export function _getArticleUrl(id: string): string;
    export function open(id: string): Promise<void>;

}