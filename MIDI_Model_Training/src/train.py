from preprocess import *
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM,Dense,Dropout
from tensorflow.keras.utils import to_categorical

notes=load_notes()

X,y,unique_notes=prepare_sequences(
notes
)

y=to_categorical(y)

model=Sequential()

model.add(
LSTM(
256,
input_shape=(
X.shape[1],
X.shape[2]
),
return_sequences=True
)
)

model.add(
Dropout(0.3)
)

model.add(
LSTM(256)
)

model.add(
Dense(
y.shape[1],
activation="softmax"
)
)

model.compile(
loss="categorical_crossentropy",
optimizer="adam"
)

model.summary()

model.fit(
X,
y,
epochs=20,
batch_size=64
)

model.save(
"models/music_model.h5"
)

print(
"Training completed"
)