import React, { useState, useEffect } from "react";
import tokenSpotify from "../auth";
import DialogDisk from "./dialogDisk";
import "./discography.css";

function Discography (){
  const [albums, setAlbums] = useState([])
  const [filters, setFilter] = useState([
    { type: "all", active: true },
    { type: "album", active: false },
    { type: "single", active: false }])
  const [albumr, setAlbumr] = useState("")


  useEffect(()=>{
    const getAllAlbums = async()=>{
        let allalbums= []
        let withOutRep = new Map();
        const  getAlbums = async (artists, firstTry = true)=> {
        let key =
          localStorage.getItem("tokenBM") ||
          (!(await tokenSpotify()) && localStorage.getItem("tokenBM"));
    
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${key}`);
    
        let requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };
        let res = await fetch(
          `https://api.spotify.com/v1/artists/${artists}/albums`,
          requestOptions
        )
          .then(response => response.text())
          .then(result => {
            let resultobj = JSON.parse(result);
            if (resultobj.error) {
              throw resultobj.error;
            }
            return resultobj.items
          })
          .catch(error => {
            if (
              error.status === 401 &&
              error.message === "The access token expired"
            ) {
              localStorage.removeItem("tokenBM")
              if (firstTry) return getAlbums(artists, false)
              /*for refresh the token only 1 time */
            }
          })
          return res;
        }
        let bandAlbums = await getAlbums("5Wh3G01Xfxn2zzEZNpuYHH")
        
        bandAlbums.forEach(a=> {
          if(! withOutRep.has(a.name.toLowerCase())){
            allalbums.push(a);
            withOutRep.set(a.name.toLowerCase(),1)
          }
        })
        let alterbandAlbums = await getAlbums("2OIN4qI2EqAsEhrVlnfi02")
        alterbandAlbums.forEach(a=> {
          if(! withOutRep.has(a.name.toLowerCase())){
            allalbums.push(a);
            withOutRep.set(a.name.toLowerCase(),1)
          }
        })
        setAlbums(allalbums)
    }
    getAllAlbums();
  },[])
  const filterFunc =(filter) =>{
    if (filter.active) return;

    let filtersmod = filters.map(filterunmod =>
      filterunmod.type === filter.type
        ? { ...filterunmod, active: true }
        : { ...filterunmod, active: false }
    );
    let functfilter =
      filter.type === "all"
        ? a => true
        : filter2comparetype => filter.type === filter2comparetype;
    let albumsfilters = albums.map(album =>
      functfilter(album.album_type)
        ? {
            ...album,
            classStyle: ""
          }
        : {
            ...album,
            classStyle: " hidden"
          }
    );
    setFilter(filtersmod)
    setAlbums(albumsfilters)
  }
  const closeDisk =() =>{
    setAlbumr(false)
  }
    return (
      <div className="container">
        <h1>Discography</h1>
        <DialogDisk
          album={albumr}
          display={albumr}
          close={() => closeDisk()}
        />
        <div className="filters">
          {filters.map(filter =>(
              <a
                href={`filter albums by  ${filter.type}`}
                key={filter.type}
                style={filter.active ? { color: "#fff301" } : {}}
                onClick={e => {
                  e.preventDefault();
                  filterFunc(filter);
                }}
              >
                {filter.type}
              </a>
            ))}
        </div>
        <div className="principal albums">
          {albums.map(album =>( 
            <Tape key={album.name} album={album} setAlbumr={setAlbumr}/>
            ))}
        </div>
      </div>
    )
}

const Tape=({album, setAlbumr})=>{
  
  const openAlbum=()=>{setAlbumr(album)}
  return (
    <div
    key={album.name}
    className={"album ".concat(`${album.classStyle}`)}
  >
    <img
      src={album.images[0].url}
      alt="album cover"
      onClick={() => {
        openAlbum()
      }}
    />
    <p onClick={() => {openAlbum()}}>
      {album.name}
    </p>
    <p
      className="color"
      onClick={() => {openAlbum()}}
    >
      {album.release_date}
    </p>
  </div>

  )
}
export default Discography;
