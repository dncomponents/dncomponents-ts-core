/**
 * @author nikolasavic
 * <p>
 * Default name for translation class is AppMessages.
 * that means when you refere to this object in java code you call I18n.get().getValue("someProperty")
 * or from html file {{someProperty}}
 * <p>
 * If you want to add Translation you add sufix that begins with underscore:
 * e.g AppMessages_spanish.java and its properties file AppMessages_spanish.properties
 * <p>
 * If you have class other than AppMessages, e.g MyCustomMessages in java code you refer to this object
 * I18n.get("MyCustomMessages").getValue("someProperty")...
 * or from html file {{MyCustomMessages:someProperty}}
 */
export class DnI18e {

    static DEFAULT = 'AppMessages';

    static START_TAG = '{{';
    static END_TAG = '}}';

    private keyValues = new Map<String, KeyValue>();

    //it contains unique list of default translation names and current I18n objects
    //e.g default name AppMessages can have different I18n objects
    //if you want to switch to e.g spanish version you register AppMessage_spanish i18n object
    //I18e.put(new AppMessage_spanish()); this will set AppMessages - AppMessage_spanish pair to lfiles
    private static lfiles = new Map<String, DnI18e>();


    private fallback: DnI18e;

    private static SEPARATOR = ':';
    private static MORE_THAN = '>';
    private static LESS_THAN = '<';
    private static EQUALS = '=';

    private name = 'DnI18e';


    public setName(name: string): void {
        this.name = name;
    }

    public getFallback(): DnI18e {
        return this.fallback;
    }

    public setFallback(fallback: DnI18e): void {
        this.fallback = fallback;
    }

    public getValue(key: string, args?: Array<any>): string {//todo
        return '';
//     let keyValue = this.keyValues.get(key);
//     if (keyValue == null && this.fallback != null) {
//         keyValue = this.fallback.keyValues.get(key);
//     }
//     if (keyValue == null)
//         throw new DOMException(key + " not found. Check property file or it must be a typo?.");
//     let value = keyValue.value;
//     //if has items with rules
//     if (keyValue.items.length!=0) {
//         value = keyValue.getRootKeyValue().value;
//         for (let allItemsKey in keyValue.getAllItems()) {
//             allItemsKey.
//         }
//         for (KeyValue item : keyValue.getAllItems()) {
//             if (item.rule == null)
//                 continue;
//             Integer orderNumberRule = Integer.parseInt(getBetween(item.rule, '{', '}'));
//             int n = item.rule.indexOf('}');
//             String operator = getBetween(item.rule, n, n + 2);
//             Integer ruleValue = Integer.parseInt(getBetween(item.rule, n + 1, n + 3));
//             if (orderNumberRule == null || (orderNumberRule != null && orderNumberRule >= args.length)
//                 || operator == null || operator.isEmpty())
//                 continue;
//             if (operator.equals("=")) {
//                 if (args[orderNumberRule].equals(ruleValue)) {
//                     value = item.value;
//                     break;
//                 }
//             }
//         }
//     }
//     do {
//         final String between = getBetween(value, '{', '}');
//         if (between == null || between.trim().isEmpty())
//             break;
//         Integer orderNumb = Integer.parseInt(between);
//         if (args == null || orderNumb >= args.length)
//             break;
//         value = value.replace("{" + orderNumb + "}", args[orderNumb] + "");
//     } while (true);
//
// //        if (keyValue.items != null) {
// //            for (KeyValue item : keyValue.items) {
// //                 final Object arg = args[2];
// //            }
// //        } else {
// //            return keyValue.value;
// //        }
//     return value;
// }
    }

    public getAllItems(): Array<KeyValue> {
        let keyValues: Array<KeyValue> = new Array();
        // keyValues.push(this.items);
        return keyValues;
    }

    public putValue(key: string, value: string): void {
        let keyValue = new KeyValue(key, value);
        let between = '';
        // let between = this.getBetween(key, '[', ']'); //todo
        let keyOrg = key;
        if (between != null && between.length != 0) {
            keyOrg = key.substring(0, key.indexOf('['));
            keyValue.key = keyOrg;
            keyValue.rule = between;
        }
        let existing = this.keyValues.get(keyOrg);
        if (existing != null)
            existing.items.push(keyValue);
        else
            this.keyValues.set(keyOrg, keyValue);
    }


    // static getBetween(text: String, c1: Character, c2: character): String {
    //     try {
    //         return text.substring(text.indexOf(c1) + 1, text.indexOf(c2));
    //     } catch (Exception
    //     ex;
    // )
    //     {
    //         return null;
    //     }
    // }
    //
    // static getBetween(text: string, index1: number, index2: number): string {
    //     try {
    //         return text.substring(index1 + 1, index2);
    //     } catch (Exception
    //     ex;
    // )
    //     {
    //         return null;
    //     }
    // }
    //
    static getBetween(text: string, c1: string, c2: string): string {
        return text.substring(text.indexOf(c1) + c1.length, text.indexOf(c2));
    }

    private replace(text: string, value: string): void {
        text.replace(text, value);
    }

    public static get(s?: string): DnI18e {
        return this.lfiles.get(s ? s : this.DEFAULT);
    }


    public static put(name: string, i18e: DnI18e): void {
        this.lfiles.set(name, i18e);
    }

    public static set(i18e: DnI18e): void {
        this.lfiles.set(this.checkName(i18e), i18e);
    }

    private static checkName(i18e: DnI18e): string {
        let name = this.getClassName();
        if (name.includes('_')) {
            name = name.substring(0, name.indexOf('_'));
        }
        return name;
    }

    static getClassName(): string {
        return 'DnI18e';
    }
}

export class KeyValue {

    key: string;
    value: string;
    //null is default keyValue
    rule: string;
    items = new Array<KeyValue>();

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    getRootKeyValue(): KeyValue {
        if (this.items.length != 0) {
            for (let item of this.items) {
                if (item.rule == null)
                    return item;
            }
        }
        return this;
    }

}