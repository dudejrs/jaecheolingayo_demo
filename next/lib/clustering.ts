
interface ClustringResult<Data> {
  centroid : Data,
  data : {
    value: number,
    members: Data[]
  }
}

function assignClusters<Data>(data: Data[], clusters: number[], centroids: Data[], distance: (d1: Data, d2: Data) => number) {
  for (let i = 0; i < data.length; i++) {
    let minDistance = Infinity;
    let cur = 0;

    for (let j = 0; j < centroids.length; j++) {
      const d = distance(data[i], centroids[j]) 
      if (d < minDistance) {
        minDistance = d;
        cur = j
      }
    }
    clusters[i] = cur
  }
}

function updateCentroids<Data>(data: Data[], clusters: number[], centroids: Data[], distance: (d1: Data, d2: Data) => number, average: (d: Data[]) => Data) {
  for (let i = 0; i < centroids.length; i++) {
    const clusteredCoords = clusters
      .map((nearest_centroid, j) : [number, Data] => [nearest_centroid, data[j]])
      .filter(([nearest_centroid, _]) => nearest_centroid === i)
      .map(([nearest_centroid, data]) => data)

    if (clusteredCoords.length === 0) {
      continue
    }

    centroids[i] = average(clusteredCoords);
  }
}

function takeGenerator<T>(gen: Generator<T>, count: number): T[] {
  const arr: T[] = [];
  const iterator = gen[Symbol.iterator]();
  for (let i = 0; i < count; i++) {
    const { value, done } = iterator.next();
    if (done) break;
    arr.push(value);
  }
  return arr;
}

export function kMeans<Data>(data: Data[], k: number, iter: number, 
  randomGenerator : Generator<Data>, 
  distance: (d1: Data, d2: Data) => number, 
  average: (d: Data[]) => Data,
  calculateFunc: (d: Data[]) => number = (d) => d.length
  ) : ClustringResult<Data>[] {
  const centroids = takeGenerator(randomGenerator, Math.floor(k));
  const clusters = Array.from(({length: data.length}), () => Math.floor(Math.random() * centroids.length))

  for (let i = 0; i < iter; i++) {
    assignClusters(data, clusters, centroids, distance)
    updateCentroids(data, clusters, centroids, distance, average)

  }

  return centroids
  .map((centroid, i)=> {
    return {
    centroid,
    data: {
        value : calculateFunc(clusters
          .map((nearest_centroid, j) => [nearest_centroid, j])
          .filter(([nearest_centroid]) => nearest_centroid === i)
          .map(([_, j])=> data[j])),
        members: clusters
          .map((nearest_centroid, j) => [nearest_centroid, j])
          .filter(([nearest_centroid]) => nearest_centroid === i)
          .reduce((acc, [nearest_centroid, j]) => [...acc, data[j]], [] as Data[]),
      }
    }
  })
  .filter(({data})=> data.members.length > 0);
}

