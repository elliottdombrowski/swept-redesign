import React, { useState, useRef, useEffect } from 'react';
import { useToast, Spinner } from '@chakra-ui/react';
import { GET_WARD, QUERY_USER_SWEEPERS } from '../../utils/queries';
import { SAVE_SWEEPER } from '../../utils/mutations';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

import AnimatePage from '../../AnimatePage';

import './styles.scss';
import './query.scss';

// Import mapbox - must add exclamation point to exclude from transpilation and disable esline rule 
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
// set the access token
// mapboxgl.accessToken = 'pk.eyJ1IjoianVzdGlua2VtcDEwIiwiYSI6ImNreWt2ejV4MjJ6eHYydnBtcmVnZmNzejYifQ.LwzcX603o5VIt1PDFd-9CA';
mapboxgl.accessToken = process.env.MAPBOX_KEY;

const Sweeper = ({themeStyles, theme}) => {
  const saveIcon = <FontAwesomeIcon icon={faBookmark} className='save-icon' />

  const wardNumber = useRef('');
  const [ward, setWard] = useState('');
  const [saveSweeper, { data: saveSweeperData }] = useMutation(SAVE_SWEEPER);
  const [getSweepers] = useLazyQuery(QUERY_USER_SWEEPERS)
  const [err, setErr] = useState('');
  const [updatedSweepers, setUpdatedSweepers] = useState();

  const toast = useToast();
  const id = 'toast';

  //WARD FORM USEQUERY
  const { loading, data } = useQuery(GET_WARD, {
    variables: { wardNumber: ward }
  });
  const wardInfo = data?.getWard || [];

  //WARD FORM SUBMIT
  const wardNumberSubmit = async (event, i) => {
    event.preventDefault();
    //THROW ERROR IF SEARCH DOESN'T MATCH WARD NUMBER
    if (wardNumber.current.value.length == 2 && wardNumber.current.value > 50) {
      document.getElementById('error-msg').classList.add('active');
      setErr('Please enter a valid Chicago Zipcode or Ward Number (1-50)');
      return false;
    }
    //THROW ERROR IF SEARCH DOESN'T MATCH ZIPCODE
    if (wardNumber.current.value.length == 3 || wardNumber.current.value.length == 4 || wardNumber.current.value.length > 5) {
      document.getElementById('error-msg').classList.add('active');
      setErr('Please enter a valid Chicago Zipcode or Ward Number (1-50)');
      return false;
    }
    //THROW ERROR IF NO SEARCH VALUE
    if (!parseInt(wardNumber.current.value)) {
      document.getElementById('error-msg').classList.add('active');
      setErr('Please enter a valid Chicago Zipcode or Ward Number (1-50)');
      return false;
    }

    document.getElementById('error-msg').classList.remove('active');
    setWard(wardNumber.current.value);
    setErr('');
    return true;
  };

  // save sweeper fx
  const saveBtn = async (val) => {
    const isLoggedIn = localStorage.getItem('id_token');
    const uuid = localStorage.getItem('uuid');

    if (localStorage.getItem('id_token')) {
      const userInputtedWardNumber = wardNumber.current.value
      console.log(uuid)
      // if user kicks off second API call with 5+ digit then set equal 
      // or > to the 60000's (per zipcode rules)
      if (userInputtedWardNumber >= 60000) {
        try {
          // save this to mongodb
          await saveSweeper({
            variables: {
              ward: val.ward,
              month_name: val.month_name,
              section: val.section,
              dates: val.dates,
              zipcode: userInputtedWardNumber,
              // local storage atm
              user: uuid
            }
          })
          //CALL CHAKRA UI TOAST ON SAVE SUCCESS
          if (!toast.isActive(id)) {
            toast({
              id,
              title: 'Saved your Search to your Profile!',
              position: 'bottom-left',
              status: 'success',
              duration: 2000,
              isClosable: false,
            });
          }
        } catch (err) {
          //CALL CHAKRA UI TOAST ON SAVE FAILURE
          if (!toast.isActive(id)) {
            toast({
              title: 'Unable to save your Search!',
              position: 'bottom-left',
              status: 'error',
              duration: 2000,
              isClosable: false,
            });
          }
          console.log(err)
        }
      } else {
        try {
          await saveSweeper({
            variables: {
              ward: val.ward,
              month_name: val.month_name,
              section: val.section,
              dates: val.dates,
              // empty string for when only sweeper api is kicked off
              zipcode: "",
              // local storage atm
              user: uuid
            }
          })
          console.log(saveSweeper)
          setUpdatedSweepers(saveSweeper);
          //CALL CHAKRA UI TOAST ON SAVE SUCCESS
          if (!toast.isActive(id)) {
            toast({
              id,
              title: 'Saved your Search to your Profile!',
              position: 'bottom-left',
              status: 'success',
              duration: 2000,
              isClosable: false,
            });
          }
        } catch (err) {
          //CALL CHAKRA UI TOAST ON SAVE FAILURE
          if (!toast.isActive(id)) {
            toast({
              title: 'Unable to save your Search!',
              position: 'bottom-left',
              status: 'error',
              duration: 2000,
              isClosable: false,
            });
          }
          console.log(err)
        }
      }
    } else {
      //CALL CHAKRA UI TOAST IF NOT LOGGED IN
      if (!toast.isActive(id)) {
        toast({
          title: 'You must be logged in!',
          position: 'bottom-left',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          onCloseComplete: () => window.location.assign('/login')
        });
      }
      // window.location.assign("/login")
    }
  }

  // MAPBOX
  // set default lat, long, and zoom for map - Chicago
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-87.62);
  const [lat, setLat] = useState(41.88);
  const [zoom, setZoom] = useState(8);

  let mapTheme;

  useEffect(() => {
    if (!theme) {
      mapTheme = 'mapbox://styles/mapbox/streets-v11'
    } else {
      mapTheme = 'mapbox://styles/mapbox/dark-v10'
    }
  }, []);

  // initialize the map, code will be invoked right after app is inserted in DOM tree of html page
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `${mapTheme}`,
      center: [lng, lat],
      zoom: zoom
    });
  });

  // function that stores the lat, lng, and zoom from user input
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    if (saveSweeperData) {
      getSweepers()
    }
  }, [saveSweeperData])

  const mapWidth = {
    full: { width: '205%'},
    half: { width: '100%'}
  };

  return (
    <AnimatePage>
      <main className='sweeper-wrapper'>
        <label 
          className='sweeper-header-label'
          style={!theme? themeStyles.containerLight : themeStyles.containerDark}
        >
          Find your Street Sweeper Schedule!
        </label>

        <div className='grid-wrapper'>
          <section 
            className='sweeper-form-wrapper'
            style={!theme? themeStyles.containerLight : themeStyles.containerDark}
          >
            <div className='zip-form-wrapper'>
              <form
                onSubmit={(event) => wardNumberSubmit(event)}
                className='zipform-wrapper'
              >
                <input
                  ref={wardNumber}
                  name='wardNumber'
                  placeholder='Enter your Ward Number or Zipcode!'
                  className='zipform-input'
                />
                <button
                  type='submit'
                  className='zipform-input zipform-btn'
                >
                  FIND YOUR SCHEDULE!
                </button>
                <p 
                  className='error-msg' 
                  id='error-msg'
                  style={!theme ? themeStyles.searchFormErrorLight : themeStyles.searchFormErrorDark}
                >
                  {err}
                </p>
              </form>
            </div>
          </section>
          {loading ? (
            <section className='sweeper-data-output-wrapper'>
              <div className='spinner-wrapper'>
                <Spinner
                  color='blue.500'
                  emptyColor='gray.200'
                  size='xl'
                  thickness='5px'
                  speed='0.6s'
                  className='loading-spinner'
                />
              </div>
            </section>
          ) : (
            <section className='sweeper-data-output-wrapper'>
                <div 
                  className={!wardInfo.length ? 'form-warning' : ''}
                  style={!theme? themeStyles.containerLight : themeStyles.containerDark}
                >
                  {!wardInfo.length ? 
                    (
                      <span>
                        <h1>No results yet!</h1>
                        <h2>Street Sweepers operate from April 1st - November 30th.</h2>
                      </span>
                    )
                    : ''
                  }
                </div>
              {
                wardInfo.map((info, index) => {
                  return (
                    <div 
                      className='sweeper-data-output' 
                      key={index}
                      style={!theme? themeStyles.containerLight : themeStyles.containerDark}
                    >
                      <div className='sweeper-info-wrapper'>
                        <p className='sweeper-ward'>Ward {info.ward}: </p>
                        <span className='sweeper-search-date'>{info.month_name.toLowerCase()} {info.dates.split(',').join(', ')}</span>
                      </div>
                      <button className='login-btn save-btn' onClick={() => saveBtn(info)}>
                        <i>
                          {saveIcon}
                        </i>
                        SAVE
                      </button>
                    </div>
                  )
                })
              }
            </section>
          )}

          {/* Mapbox */}
          <div className='outer-map-container' style={!wardInfo.length ? mapWidth.full : mapWidth.half}>
            <div ref={mapContainer} className="map-container" />
          </div>
        </div>
      </main >
    </AnimatePage>
  );
};

export default Sweeper;