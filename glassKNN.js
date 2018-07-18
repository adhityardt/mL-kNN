/* 
https://hackernoon.com/machine-learning-with-javascript-part-2-da994c17d483
Steps:
1. Install the libraries
2. Initialize the library and load the Data
3. Dress the Data
4. Train your model and then test it
5. Start predicting
6. Done, Run the program
*/

//Initializing the library
const KNN = require('ml-knn')
const prompt = require('prompt')
const csv = require('csvtojson')
//Load the data
let glassDataset = ''
// csv()
// .fromFile('./glass.csv')
// .then(result => {
//   glassDataset = result
//   console.log(glassDataset)
// })
let getData = async function () {
  glassDataset = await csv().fromFile('./glass.csv')
  //Dress the data
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  }

  let data = shuffleArray(glassDataset),
      X = [],
      y = [],
      separationSize = data.length * 0.90 //memisahkan antara test dataset dan train model untuk mendapakan nilai error

  let types = new Set() // mendapatkan type masing2 row
  data.forEach((row) => {
    types.add(row.Type)
  }) 

  typesArray = [...types]
  //[setosa, versicolor, virginica]

  data.forEach((row) => {
    var rowArray, typeNumber;
    rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(0,9);// turn the data into an array
    typeNumber = typesArray.indexOf(row.Type) // Mengubah string ke number
    X.push(rowArray)
    y.push(typeNumber)
  })

  //Dapetin data training dan test
  let trainingSetX = X.slice(0, separationSize),
      trainingSetY = y.slice(0, separationSize),
      testSetX = X.slice(separationSize),
      testSetY = y.slice(separationSize)

  function train() {
  //Dapetin model
  //   console.log(trainingSetX, trainingSetY)
  knn = new KNN(trainingSetX, trainingSetY, {k: 5});
  test();
  }
  function test() {
    //Dapetin hasil prediksi dan errornya / uji coba modelnyta
    const result = knn.predict(testSetX);
    const testSetLength = testSetX.length;
    const predictionError = error(result, testSetY);
    console.log(`Test Set Size = ${testSetLength} and number of Misclassifications = ${predictionError}`);
    predict();
  }
  //Melakukan prediksi 
  function predict() {
    let temp = [];
    prompt.start();
    prompt.get(['RI', 'Na', 'Mg', 'Al', 'Si', 'K', 'Ca', 'Ba', 'Fe'], function (err, result) {
      if (!err) {
        for (var key in result) {
          temp.push(parseFloat(result[key]));
        }
        console.log(`========== Result Test ============`)
        console.log(`With ${temp}`);
        console.log(`type of glass =  ${typesArray[knn.predict(temp)]}`)
      }
    });
  }

  function error(predicted, expected) {
  let misclassifications = 0;
  for (var index = 0; index < predicted.length; index++) {
      if (predicted[index] !== expected[index]) {
          misclassifications++;
      }
  }
  return misclassifications;
  }

  train()
}

//1.51775,12.85,3.48,1.23,72.97,0.61,8.56,0.09,0.22
getData()

