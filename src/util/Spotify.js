const clientID = '84ec129716e14229b1a897886e9c3d77';
const redirectURI = 'http://ronda_jammming.surge.sh';
//const redirectURI = 'localhost:3000'

let accessToken;

const Spotify = {
  getAccessToken() {
    let checkAccessToken = window.location.href.match(/access_token=([^&]*)/);
    let checkExpiration = window.location.href.match(/expires_in=([^&]*)/);
    let accessExpiration;
    if (accessToken) {
      return accessToken;
    } else if (checkAccessToken !== null && checkExpiration !== null) {
        accessToken = checkAccessToken[1];
        accessExpiration = checkExpiration[1];
        window.setTimeout(() => accessToken = '', accessExpiration * 1000);
        window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(term) {
    window.localStorage.setItem('searchTerm',term);
    if(!accessToken) {
      this.getAccessToken();
    }
    const url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    return fetch(url, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks){
        return jsonResponse.tracks.items.map(track => (
          {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          })
        )
      } else {
        return [];
      }
    });
  },

  savePlaylist(name, tracks) {
    let defaultAccessToken = accessToken;
    let defaultHeaders = {Authorization: `Bearer ${defaultAccessToken}`};
    let userID;
    let playlistID;

    if(!name || !tracks) {
      return;

    } else {

      return fetch('https://api.spotify.com/v1/me', {headers: defaultHeaders}
      ).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if (jsonResponse.id) {
          userID = jsonResponse.id;

      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${defaultAccessToken}`,
        'Content-Type': 'application/json'},
        body: JSON.stringify({name: name})
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        if(jsonResponse.id) {
          playlistID = jsonResponse.id;

      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${defaultAccessToken}`,
        'Content-Type': 'application/json'},
        body: JSON.stringify({uris: tracks})
      }).then(response => {
        return response.json();
      });
    }
  })
}
});

    }

  }

};

export default Spotify;
