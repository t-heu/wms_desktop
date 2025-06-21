[![x](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=X&logoColor=white)](https://twitter.com/t_h_e_u)
[![linkedin](https://img.shields.io/badge/Linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/matheusgbatista/)
[![web](https://img.shields.io/badge/web-000000?style=for-the-badge&logo=web&logoColor=white)](https://t-heu.github.io)

## About (WMS Labeler)

![alt text](docs/logo.png "Scree Home")

WMS Labeler é uma aplicação web desenvolvida para simplificar e otimizar o processo de geração de etiquetas WMS (Warehouse Management System). Criada com tecnologias modernas, a ferramenta oferece uma solução rápida, eficiente e intuitiva, eliminando a necessidade de softwares legados como Excel VBA e Windows XP, enquanto melhora significativamente a produtividade em ambientes logísticos.

_OBS.: Esse sistema foi adaptado para uma empresa em específico._

## 🚀 Tecnologias

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

- [Next.js](https://nextjs.org/docs): Framework React para desenvolvimento de aplicações web.
- [XLSX](https://sheetjs.com/): Biblioteca para manipulação de arquivos Excel (leitura e escrita).

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=Sass&logoColor=white)
![ts](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![react](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)


## 📦 Instalação e Configuração

1. Clone este repositório.
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run start
   # ou
   yarn start
   ```
4. Caso queira gerar arquivo .exe:
```
npm run make -- --platform=win32 --arch=x64
ou
npx electron-forge make --platform=win32
```

## 🖼️ Preview
![alt text](docs/image.png "Scree Home")
![alt text](docs/image1.png "Screen Tag")

## 🛠️ Como Usar

- **Importar um arquivo Excel**:
  1. Clique no botão "Escolher Arquivo".
  2. Selecione o arquivo Excel.
  3. Clique no botão "Gerar".
  4. Aguarde o processamento dos dados e depois gere PDF.
  5. Registro de log em UserData Path: C:\Users\SEU_USUARIO\AppData\Roaming\NOME_DO_APP

## 🐛 Problemas e Suporte

Caso encontre algum problema, sinta-se à vontade para abrir uma [issue](https://github.com/t-heu/wms_desktop/issues).

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## OBS.:

```
Caso tamanho "size: 76.2mm 50.8mm;" não de certo tentar:
C7 (81 mm x 114 mm)
B8 (62 mm x 88 mm)
Cartão de Visita (85 mm x 55 mm (ISO 7810 ID-1))
```
