const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");


const config = {
    entry: ENTRY_FILE,
    mode: MODE,
    plugins: [new MiniCssExtractPlugin({
        filename: "style.css"
    })],
    module: {
        rules: [
            {
                test: /\.(scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader"
                    },
                    "sass-loader"
                ]
            },
        ],
    },
    output: {
        path: OUTPUT_DIR,
        filename: "[name].js"
    }
};

module.exports = config;