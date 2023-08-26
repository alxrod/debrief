import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from keras.preprocessing.text import Tokenizer
from sklearn.cluster import KMeans

df = pd.read_csv("/Users/andrewrodriguez/Desktop/debrief/backend/ai/curator/article_stats.csv")
with open('/Users/andrewrodriguez/Desktop/debrief/backend/ai/curator/20k.txt') as f:
    words = f.readlines()
    
corpus = []
for word in words:
    corpus.append([word[:-1]])
tokenizer = Tokenizer()
tokenizer.fit_on_texts(corpus)

titleTokenizer = Tokenizer()
titleCorpus = []
for index, row in df.iterrows():
    titleCorpus.append([row["article_title"]])
titleTokenizer.fit_on_texts(titleCorpus)


matrices = tokenizer.texts_to_matrix(df['article_summary'], mode = 'count')
ohe = []
for i in range(454):
    ohe.append(matrices[i][0:])

# Perform kmean clustering
num_clusters = 50
clustering_model = KMeans(n_clusters=num_clusters)
clustering_model.fit(ohe)
cluster_assignment = clustering_model.labels_

articles = df["article_summary"]

article_clusters = [[] for i in range(num_clusters)]
for article_id, cluster_id in enumerate(cluster_assignment):
    article_clusters[cluster_id].append(articles[article_id])

for i, cluster in enumerate(article_clusters):
    print("Cluster ", i+1)
    #print(cluster)
    print("")

print(article_clusters[1][0])
print("\n\n\n")
print(article_clusters[1][1])
print("\n\n\n")
print(article_clusters[1][2])
print("\n\n\n")
print(article_clusters[1][3])
