import React, { useState } from 'react';

const HistoryList = ({ history, onHistoryClick, setHistory }) => {
    const [selectedItems, setSelectedItems] = useState([]);

    if (history.length === 0) {
        return <p style={{textAlign: 'center', color: '#666'}}>No search history yet.</p>;
    }

    const toggleSelectItem = (ip) => {
        setSelectedItems(prev => 
            prev.includes(ip) ? prev.filter(id => id !== ip) : [...prev, ip]
        );
    };

    const handleDeleteSelected = () => {
        const newHistory = history.filter(item => !selectedItems.includes(item.ip));
        setHistory(newHistory);
        setSelectedItems([]);
    };

    return (
        <div style={styles.historyContainer}>
            <div style={styles.historyHeader}>
                <h3>Search History</h3>
                {selectedItems.length > 0 && (
                    <button 
                        onClick={handleDeleteSelected} 
                        style={styles.deleteButton}
                    >
                        Delete {selectedItems.length} Selected
                    </button>
                )}
            </div>
            
            <ul style={styles.list}>
                {history.map((item) => (
                    <li key={item.ip} style={styles.listItem}>
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item.ip)}
                            onChange={() => toggleSelectItem(item.ip)}
                            style={styles.checkbox}
                        />
                        <div style={styles.details} onClick={() => onHistoryClick(item.ip)}>
                            <span style={styles.ip}>{item.ip}</span> 
                            <span style={styles.geo}>{item.geo}</span>
                        </div>
                        <span style={styles.time}>{item.time}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    historyContainer: { margin: '30px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff' },
    historyHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    list: { listStyle: 'none', padding: 0 },
    listItem: { display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' },
    checkbox: { marginRight: '10px' },
    details: { flexGrow: 1, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' },
    ip: { fontWeight: 'bold', minWidth: '150px' },
    geo: { color: '#555', fontStyle: 'italic' },
    time: { fontSize: '0.8em', color: '#999', minWidth: '80px', textAlign: 'right' },
    deleteButton: { padding: '5px 10px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9em' }
};

export default HistoryList;