import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER_SWEEPERS, MUTATION_DELETE_SWEEPER } from '../../utils/queries';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import './styles.scss';
import './query.scss';

const deleteSave = <FontAwesomeIcon icon={faTrash} className="delete-save" />

const SavedSweepers = () => {
  const [userId, setUserId] = useState(localStorage.getItem('uuid'));
  const [updatedSweepers, setUpdatedSweepers] = useState();

  const { loading, data } = useQuery(QUERY_USER_SWEEPERS, {
    variables: { user: userId },
    fetchPolicy: 'network-only'
  });

  const userSweepers = data?.getUserSweepers || [];
  const [deleteSweeper, { data: deletedSweeperData, loading: deletedSweeperLoading }] = useMutation(MUTATION_DELETE_SWEEPER)

  useEffect(() => {
    if (deletedSweeperData) {
      console.log('sweeper deleted')
    }
  }, [deletedSweeperData]);

  //OPEN SWEEPER DELETE SAVE CONFIRMATION MODAL
  const openSweeperConfirmationModal = () => {
    document.getElementById('delete-modal').classList.add('active');
  };
  
  //CLOSE SWEEPER DELETE SAVE CONFIRMATION MODAL
  const closeSweeperConfirmationModal = () => {
    document.getElementById('delete-modal').classList.remove('active');
  };

  //DELETE SAVE BY ID
  //TODO- REFACTOR TO AVOID FORCE RELOAD
  const handleDeleteSweeper = (id) => {
    deleteSweeper({ variables: { id } })
    window.location.reload('/sweeper')
  };

  return (
    <section className='recent-search-wrapper'>
      <div className='recent-search-header'>
        <h1 className='recent-searches'>Saved Sweeper Searches</h1>
        {/* <h1 className='recent-searches recent-searches-date'>| April 1st - November 30th |</h1> */}
      </div>
      {
        userSweepers.map((singleSweeper) => {
          return (
            <div className='sweeper-data-output' key={singleSweeper._id}>
              <span className='saved-info'>
                <h2 className='sweeper-ward'>Ward {singleSweeper.ward} is being swept on:</h2>
                <h2 className='sweeper-ward'>{singleSweeper.month_name.toLowerCase()} {singleSweeper.dates.split(',').join(', ')}</h2>
              </span>

              <button className='save-btn' onClick={openSweeperConfirmationModal}>{deleteSave}</button>
              <div className='confirm-delete-modal' id='delete-modal'>
                <h1>Are you sure you want to delete this search?</h1>
                <span className='confirm-btn-wrapper'>
                  <button
                    onClick={closeSweeperConfirmationModal}
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => handleDeleteSweeper(singleSweeper._id)}
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
  )
}

export default SavedSweepers;