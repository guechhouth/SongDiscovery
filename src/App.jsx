import { useState } from 'react'
import './App.css'


function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [prevSongs, setPrevSongs] = useState([]);
  const [banList, setBanList] = useState({
    artists:[],
    genres:[],
    years:[]
  });

  const getRandomLetter = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    return letters[Math.floor(Math.random() * letters.length)];
  }

  const fetchSongs = async () => {
    const term = getRandomLetter();
    const url = `https://itunes.apple.com/search?term=${term}&entity=musicTrack&limit=100`;
    try{
      const response = await fetch(url);
      const data = await response.json();
      const song = data.results;

      const filtered = song.find(song => {
        const year = new Date(song.releaseDate).getFullYear();
        return (
          !banList.artists.includes(song.artistName) &&
          !banList.genres.includes(song.primaryGenreName) &&
          !banList.years.includes(year)
        )
      })

      if (filtered){
        const imageUrl = filtered.artworkUrl100;
        setCurrentImage(imageUrl);
        setCurrentSong({
          title: filtered.trackName,
          artist: filtered.artistName,
          genre: filtered.primaryGenreName,
          year: new Date(filtered.releaseDate).getFullYear(),
          image: filtered.artworkUrl100,
        })
        if (currentSong){
          setPrevSongs((prev) => [...prev, currentSong]);
        }

      } else{
        alert("No songs found that match you preferences. Please try again.");
      }
    } catch (error) {
      console.error('Error fetching songs:', error);

    }
  };
  const banCurrent = (type) => {
      if (!currentSong) return;
      const value = currentSong[type];
      setBanList(prev => ({
        ...prev,
        [type + 's']: [...new Set([...prev[type + 's'], value])] 
      }));
    };
  
    const unban = (type, value) => {
      setBanList(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item !== value)
      }))
    }


  return (
    <div>
      <div className= "header">
        <h1>🎵 Discover Random Songs 🎵</h1>
        <h3>Discover songs from different genres and artists</h3>
        <button id="discover" onClick={fetchSongs}>Discover</button>

        {currentSong && (
          <div className="song-display">
            <h3>Title: {currentSong.title}</h3>
            {/*display song title and genre and artist*/}
            <div className="buttons">
              <button className="button" onClick={() => banCurrent('artist')}>Artist: {currentSong.artist}</button>
              <button className="button" onClick={() => banCurrent('genre')}>Genre: {currentSong.genre}</button>
              <button className="button" onClick={() => banCurrent('year')}>Year: {currentSong.year}</button>
            </div>
            <img className="image" src={currentImage} alt="Album" />
          </div>
        )}

      </div>

      <div className="container">
        {/*song history*/}
        <div className="left">
          <h3>Song History</h3>
          {prevSongs.map((song, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <img src={song.image} alt="history"/>
              <p style={{ fontSize: '14px' }}>{song.title}</p>
            </div>
          ))}
        </div>

        {/*ban list*/}
        <div className="right">
          <h3>Ban List</h3>
          <p>Select an attribute in your listing to ban it</p>
          <div className="filter">
            {banList.artists.map((artist, index) => (
              <span 
                key={index} 
                style ={{ cursor: 'pointer', color: 'red', border: '1px solid red'}}
                onClick={() => unban("artists", artist)}> {artist} ❌ </span>
            ))}
    
            {banList.genres.map((genre, index) => (
              <span 
                key={index} 
                style ={{ cursor: 'pointer', color: 'red', border: '1px solid red'}}
                onClick={() => unban("genres", genre)}> {genre} ❌ </span>
            ))}

            {banList.years.map((year, index) => (
              <span 
                key={index} 
                style ={{ cursor: 'pointer', color: 'red', border: '1px solid red'}}
                onClick={() => unban("years", year)}> {year} ❌ </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
