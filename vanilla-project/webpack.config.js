module.exports = {  
  context: `${__dirname}/src/js/`,  
  entry: {  
    app: './main.js',  
  },  
  output: {  
    filename: '[name].js',  
  },  
  resolve: {  
    alias: {  
      '@js': `${__dirname}/src/js`,  
    },  
    modules: [`${__dirname}/node_modules/`],  
    extensions: ['.js'],  
    symlinks: false,  
  },  
  module: {  
    rules: [
      // Добавляем правило для обработки JavaScript-файлов с помощью Babel
      {
        test: /\.js$/, // Применять Babel только к .js файлам
        exclude: /node_modules/, // Исключить папку node_modules
        use: {
          loader: 'babel-loader', // Использовать babel-loader
        },
      },
    ],  
  },  
};
