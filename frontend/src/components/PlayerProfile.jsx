import React from 'react';

const PlayerProfile = ({ account, reward, badges }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Player Profile</h2>
      <p style={styles.accountText}>Account: {account}</p>

      <div style={styles.rewardSection}>
        <h3 style={styles.rewardHeader}>Your Total Reward</h3>
        <p style={styles.rewardText}>{reward} Points</p>
      </div>

      <div style={styles.badgesSection}>
        <h3 style={styles.badgesHeader}>Badges Earned</h3>
        <ul style={styles.badgesList}>
          {badges.length > 0 ? (
            badges.map((badge, index) => <li key={index} style={styles.badgeItem}>{badge}</li>)
          ) : (
            <li style={styles.noBadgeItem}>No badges earned yet</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    width: '350px',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  accountText: {
    fontSize: '16px',
    color: '#555',
  },
  rewardSection: {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#e7f3e7',
    textAlign: 'center',
  },
  rewardHeader: {
    fontSize: '18px',
    color: '#4CAF50',
  },
  rewardText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
  },
  badgesSection: {
    marginTop: '20px',
  },
  badgesHeader: {
    fontSize: '18px',
    color: '#ff9800',
    textAlign: 'center',
  },
  badgesList: {
    listStyleType: 'none',
    padding: '0',
    textAlign: 'center',
  },
  badgeItem: {
    backgroundColor: '#ffc107',
    color: '#fff',
    margin: '5px',
    padding: '8px 15px',
    borderRadius: '20px',
    display: 'inline-block',
    fontSize: '16px',
  },
  noBadgeItem: {
    fontSize: '16px',
    color: '#888',
    textAlign: 'center',
  }
};

export default PlayerProfile;
