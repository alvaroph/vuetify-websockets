
class FetchManager {
  async fetchFromOMDb(query) {
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=19f8a30e`);
    const data = await response.json();
    return data;
  }
}

const instance = new FetchManager();
export default instance;
