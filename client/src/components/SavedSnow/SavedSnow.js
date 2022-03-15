import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER_SNOW, MUTATION_DELETE_SNOW } from '../../utils/queries';

import '../SavedSweepers/styles.scss';
import '../SavedSweepers/query.scss';

const SavedSnow = () => {
  const [userId, setUserId] = useState(localStorage.getItem('uuid'));
  const [updatedSnow, setUpdatedSnow] = useState();

  const { loading, data } = useQuery(QUERY_USER_SNOW, {
    variables: { user: userId },
    fetchPolicy: "network-only"
  });
  const [deleteSnow, { data: deletedSnowData, loading: deletedSnowLoading }] = useMutation(MUTATION_DELETE_SNOW)
  const userSnow = data?.getUserSnow || [];

  useEffect(() => {
    if (deletedSnowData) {
      console.log('deleted save');
    }
  }, [deletedSnowData]);

  const openSnowConfirmationModal = () => {
    document.getElementById('delete-modal').classList.add('active');
  };

  const closeSnowConfirmationModal = () => {
    document.getElementById('delete-modal').classList.remove('active');
  };

  const handleDeleteSnow = (id) => {
    deleteSnow({ variables: { id } })
    window.location.reload('/snow');
  };
  return (
    <>
      <section className='recent-search-wrapper'>
        <div className='recent-search-header'>
          <h1 className='recent-searches'>Saved Snow Searches</h1>
          {/* <h1 className='recent-searches recent-searches-date'>| Dec 1st - April 1st |</h1> */}
        </div>
        {
          userSnow.map((singleSnow) => {
            return (
              <div className='sweeper-data-output' key={singleSnow._id}>
                <div className='snow-output-wrapper'>
                  <span className='snow-restriction-wrapper'>
                    <h1 className='snow-street'>Parking Restricted On {singleSnow.on_street}</h1>
                  </span>

                  <span className='snow-results-wrapper'>
                    <h2 className='snow-from-street'>From {singleSnow.from_stree}</h2>
                    <h2 className='snow-to-street'>To {singleSnow.to_street}</h2>
                  </span>
                </div>

                <button className='login-btn save-btn' onClick={openSnowConfirmationModal}>Delete</button>
                <div className='confirm-delete-modal' id='delete-modal'>
                  <h1>are you sure you want to delete this search?</h1>
                  <span className='confirm-btn-wrapper'>
                    <button
                      onClick={closeSnowConfirmationModal}
                    >
                      CANCEL
                    </button>
                    <button
                      onClick={() => handleDeleteSnow(singleSnow._id)}
                    >
                      DELETE
                    </button>
                  </span>
                </div>
              </div>
            )
          })
        }
      </section>
    </>


  )

}

export default SavedSnow