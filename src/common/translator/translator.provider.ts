import { TranslatorService } from 'nestjs-translator';

const headerLanguageOptions = ['language', 'lang', 'l'];

export const translatorService = (lang: string) =>
    new TranslatorService(lang, '/locales', (req) =>
        req.get(headerLanguageOptions.find((key) => req.get(key))),
    );
