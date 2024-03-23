import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFromAPI } from '../utils/api'

import Main from '../components/section/Main';
import VideoSearch from '../components/videos/VideoSearch';

import { CiBadgeDollar } from "react-icons/ci";
import { CiMedal } from "react-icons/ci";
import { CiRead } from "react-icons/ci";

const Channel = () => {
  const { channelID } = useParams();
  const [ channelDetail, setChannelDetail ] = useState();
  const [ channelVideo, setChannelVideo ] = useState();
  const [ loading, setLoading ] = useState(true);
  const [ nextPageToken, setNextPageToken] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await fetchFromAPI(`channels?part=snippet&id=${channelID}`);
        setChannelDetail(data.items[0]);

        const videosData = await fetchFromAPI(`search?channelId=${channelID}&part=snippet%2Cid&order=date`);
        setChannelVideo(videosData?.items);
        setNextPageToken(videosData?.nextPageToken);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [channelID]);

  const loadMoreVideos = async() => {
    if(nextPageToken){
      const videosData = await fetchFromAPI(`search?channelId=${channelID}&part=snippet%2Cid&order=date&pageToken=${nextPageToken}`);
      setChannelVideo(prevVideos => [...prevVideos, ...videosData?.items]);
      setNextPageToken(videosData?.nextPageToken);
      console.log(videosData.items);
    }
  };

  const channelPageClass = loading ? 'isLoading' : 'isLoaded';

  return (
    <Main title = "Channel" description = "Welcome to Channel">

      <section id = 'channel' className={channelPageClass}>
        {channelDetail&& (
          <div className='channel_inner'>
            <div className='channel_header' style={{ backgroundImage: `url(${channelDetail.brandingSettings.image.bannerExternalUrl})` }}>
                <div className='circle'>
                  <img src={channelDetail.snippet.thumbnails.high.url} alt={channelDetail.snippet.title} />
                </div>
            </div>
            <div className="channel_info">
              <h3 className='title'>{channelDetail.snippet.title}</h3>
              <p className='desc'>{channelDetail.snippet.description}</p>
              <div className="info">
                <span><CiBadgeDollar />{channelDetail.statistics.subscriberCount}</span>
                <span><CiMedal />{channelDetail.statistics.videoCount}</span>
                <span><CiRead />{channelDetail.statistics.viewCount}</span>
              </div>
            </div>
            <div className="channel_video video_inner search">
              {channelVideo && <VideoSearch videos={channelVideo} />}
            </div>
            <div className='channel_more'>
              {nextPageToken && <button onClick={loadMoreVideos}>More</button>}
            </div>
          </div>
        )}
      </section>
    </Main>
  )
}

export default Channel
