import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './HomePage'
import LoginAdmin from './LoginAdmin'
import HomePageAdmin from './HomePageAdmin'
import ManageArtists from './ManageArtists'
import ManageAlbums from './ManageAlbums'
import AddAlbum from './AddAlbum'
import ViewAlbums from './ViewAlbums'
import ViewSongsHome from './ViewSongsHome'
import AddSong from './AddSong'
import ViewSongsAdmin from './ViewSongsAdmin'
import SignupOTP from './SignupOTP'
import SignupUser from './SignupUser'
import LoginUser from './LoginUser'
import HomePageUser from './HomePageUser'
import AddPlaylist from './AddPlaylist'
import MyPlaylist from './MyPlaylist'
import AddArtist from './AddArtist'
import ViewArtists from './ViewArtists'
import History from './History'
import PremiumUser from './PremiumUser'
import Payment from './Payment'
import PremiumPageUser from './PremiumPageUser'
import ViewSongsPremium from './ViewSongsPremium'
import Profile from './Profile'

function AppRouter() {
  return (
    
      <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupOTP />} />
            <Route path="/signupuser" element={<SignupUser />} />
            <Route path="/loginuser" element={<LoginUser />} />
            <Route path="/homepageuser" element={<HomePageUser />} /> 
            <Route path="/premiumpageuser" element={<PremiumPageUser />} />
            <Route path="loginadmin" element={<LoginAdmin />} />
            <Route path="/homepageadmin" element={<HomePageAdmin />} />
            <Route path="/managealbums" element={<ManageAlbums />} />
            <Route path="/manageartists" element={<ManageArtists />} />
            <Route path="/addalbum" element={<AddAlbum />} />
            <Route path="/viewalbums" element={<ViewAlbums />} />
            <Route path="/addartist" element={<AddArtist />} />
            <Route path="/viewartists" element={<ViewArtists />} />
            <Route path="/viewsongshome" element={<ViewSongsHome />} />
            <Route path="/viewsongspremium" element={<ViewSongsPremium />} />
            <Route path="/addsong/:albumId" element={<AddSong />} />
            <Route path="/viewsongs/:albumId" element={<ViewSongsAdmin />} />
            <Route path="/playlistuser" element={<AddPlaylist />} />
            <Route path="/myplaylist" element={<MyPlaylist />} />
            <Route path="/history" element={<History />} />
            <Route path="/premiumuser" element={<PremiumUser />} />
            <Route path="/payment/:premiumId" element={<Payment />} />
            <Route path="/profile" element={<Profile />} />
        </Routes> 
      </Router>
    
  )
}

export default AppRouter
