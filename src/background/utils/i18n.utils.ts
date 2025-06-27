// src/background/utils/i18n.utils.ts

// Importa i file di localizzazione staticamente
import enMessages from './_locales/en/messages.json';
//import itMessages from './_locales/it/messages.json';
//import frMessages from './_locales/fr/messages.json'; // Esempio
//import esMessages from './_locales/es/messages.json'; // Esempio
//import cnMessages from './_locales/zh-CN/messages.json'; // Esempio
//import twMessages from './_locales/zh-TW/messages.json'; // Esempio

// Crea una mappa delle localizzazioni
const localeMap: Record<string, Record<string, { message: string }>> = {
  en: enMessages,
//  it: enMessages,
//  fr: frMessages,
//  es: esMessages,
//  cn: cnMessages,
//  tw: cnMessages
  // Aggiungi altre lingue qui
};

// Funzione per determinare la lingua del browser
const getBrowserLanguage = (): string => {
  return (navigator.language || 'en').split('-')[0];
};

// Funzione getMessage
const getMessage = (name: string, options?: string[]): string => {
  const lang = getBrowserLanguage();
  
  // Cerca il messaggio nella lingua corrente
  let file = localeMap[lang];
  
  // Se la lingua non esiste o il messaggio non è trovato, usa l'inglese
  if (!file || !file[name]) {
    file = localeMap['en'];
  }
  
  // Estrai il messaggio, usa la chiave come fallback
  const message = file[name]?.message || name;
  
  // Applica i placeholder
  return withOptions(message, options);
};

// Funzione per sostituire i placeholder ($1, $2, ecc.)
const withOptions = (message: string, options?: string[]): string => {
  if (options && options.length) {
    let str = message;
    for (const [index, value] of options.entries()) {
      str = str.replace(`$${index + 1}`, value);
    }
    return str;
  }
  return message;
};

export default getMessage;