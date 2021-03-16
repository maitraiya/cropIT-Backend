import pandas as pd
import joblib
import numpy as np
categorical_fetaures =['bajra', 'barley', 'cheak peas', 'cheak-peas', 'corn', 'jawar', 'maize', 'paddy', 'rice', 'soybean', 'sugarcane', 'wheat']
import joblib
import os
import sys
from flask import Flask, request


'''
# Importing the dataset
dataset = pd.read_csv('Stubble_Dataset.csv')
X = dataset.iloc[:, :-1].values
y = dataset.iloc[:, 3].values
categorical_fetaures = sorted(set(X[:,0]))

# Encoding categorical data
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
labelencoder = LabelEncoder()
X[:, 0] = labelencoder.fit_transform(X[:, 0])

onehotencoder = OneHotEncoder()
X = onehotencoder.fit_transform(X).toarray()

# Fitting Multiple Linear Regression to the Training set
from sklearn.linear_model import LogisticRegression
regressor = LogisticRegression()
regressor.fit(X,y)

joblib.dump(regressor, 'model.pkl')
joblib.dump(onehotencoder, 'oneHotEncoder.pkl')
'''
app = Flask(__name__)
@app.route('/',methods = ['POST'])
def getPredictedResult():
    regressor = joblib.load('model.pkl')
    onehotencoder = joblib.load('oneHotEncoder.pkl')
    material = request.form['material']
    basePrice = request.form['basePrice']
    landArea = request.form['landArea']

    test = [[material, int(basePrice), int(landArea)]]
    index = categorical_fetaures.index(material)
    test[0][0] = index
    try:
        test = onehotencoder.transform(test).toarray()

        # Predicting the Test set results
        y_pred = regressor.predict(test)
        print(y_pred[0])
        return {'result':y_pred[0]}
    except:
        return {'result':int(basePrice)*int(landArea)}
if __name__ == '__main__':
   app.run()

