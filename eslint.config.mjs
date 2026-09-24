import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      /**
       * Ойындар мен баптаулар (викторина, «Жұп тап», флеш-карталар, түс режимі) кездейсоқ
       * мазмұнды және браузерде сақталған деректерді тек бет ашылғаннан кейін оқиды.
       * Бұл — серверде жасалған HTML мен клиенттегі көрініс бірдей болуы үшін қажет
       * (гидратация сәйкессіздігі болмауы үшін). Сондықтан ережені қате емес, ескерту
       * деңгейінде қалдырамыз.
       */
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
