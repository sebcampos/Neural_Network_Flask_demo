#import dependencies
import pandas
import numpy
import hvplot.pandas
import matplotlib.pyplot as plt

#machine learning dependencies
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report

import tensorflow as tf

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from connect_sql_db import build_engine

from tensorflow.keras.utils import to_categorical
from tensorflow.keras.layers import Dense
from sklearn.preprocessing import StandardScaler, OneHotEncoder


#predictor
def nueral_network_classifier(dictionary):

    engine = build_engine(database_name="database1",host="35.225.193.21")

    cleaned_df = pandas.read_sql("select * from cleaned_table", con=engine)

    cleaned_df["stars"] = cleaned_df.stars.apply(lambda x: int(x))

    X = cleaned_df.drop(cleaned_df.dtypes[cleaned_df.dtypes == "object"].index.tolist(), axis = 1)

    print(type(X))

    y = cleaned_df.stars
    X = X.drop("stars", axis=1).values


    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        random_state = 1
    )


    X_scaler = StandardScaler()
    X_scaler.fit(X_train)
    
    
    X_train_scaled = X_scaler.transform(X_train)
    X_test_scaled = X_scaler.transform(X_test)

    enc = OneHotEncoder()
    enc.fit(y_train.values.reshape(-1, 1))
    encoded_y_train = enc.transform(y_train.values.reshape(-1, 1)).toarray()
    encoded_y_test = enc.transform(y_train.values.reshape(-1, 1)).toarray()

    model = Sequential()


    model.add(Dense(100, activation='relu', input_dim=X_train.shape[1]))

    model.add(Dense(50, activation='relu'))

    model.add(Dense(10, activation='relu'))

    model.add(Dense(5, activation="softmax"))

    model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

    summary_for_page =  model.summary()

    fit_model = model.fit(
        X_train,
        encoded_y_train,
        epochs=100,
        shuffle=True,
        verbose=2
    )

    # Make predictions
    predicted = model.predict(X_test_scaled)
    predicted = enc.inverse_transform(predicted).flatten().tolist()
    results = pandas.DataFrame({
        "Actual": y_test,
        "Predicted": predicted
    })
    results.head(10)

    #report_for_page =  classification_report(results.Actual, results.Predicted)

    
    result_df = pandas.DataFrame(
        fit_model.history,
        index = range(1, len(fit_model.history["loss"]) + 1)
    )

    #webpage_plot_loss = result_df.plot(y="loss")

    result_df = pandas.DataFrame(
        fit_model.history,
        index = range(1, len(fit_model.history["accuracy"]) + 1)
    )

    #web_page_plot_accuracy = result_df.plot(y="accuracy")


    print(dictionary)

    new_df = pandas.DataFrame(index=[dictionary["category_typed"]], columns=cleaned_df.drop(cleaned_df.dtypes[cleaned_df.dtypes == "object"].index.tolist(), axis = 1).columns)

    for i in dictionary["category_pred"]:
        new_df[i] = 1
    
    new_df.drop("stars",axis =1, inplace =True)

    new_df["longitude"] = float(dictionary["lng"][0])

    new_df["latitude"] = float(dictionary["lat"][0])
    

    new_df.fillna(0, inplace=True)


    prediction_lst_scaled = X_scaler.transform(new_df.values)

    predicted = model.predict(prediction_lst_scaled)

    predicted = enc.inverse_transform(predicted).flatten().tolist()

    #return summary_for_page, report_for_page, result_df, web_page_plot_accuracy, webpage_plot_loss, predicted

    print(predicted)

    return predicted[0]

