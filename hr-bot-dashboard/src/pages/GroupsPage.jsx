import React, { useState } from 'react';
import styles from './GroupsPage.module.css';
import { useAppContext } from '../context/AppContext';
import { HiPlus, HiOutlineTrash, HiOutlinePencil, HiExternalLink } from 'react-icons/hi';

// Форма для додавання/редагування групи
const AddGroupForm = ({ onSave, onCancel, group }) => {
  const [name, setName] = useState(group ? group.name : '');
  const [link, setLink] = useState(group ? group.link : 'https://facebook.com/groups/');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(name, link);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>Назва групи:</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} autoFocus />
      <label>Посилання на групу:</label>
      <input type="text" value={link} onChange={e => setLink(e.target.value)} />
      <div className={styles.formActions}>
        <button type="submit">Додати</button>
        <button type="button" onClick={onCancel}>Відмінити</button>
      </div>
    </form>
  );
};


function GroupsPage() {
  const { groups, addGroup, deleteGroup } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddGroup = (name, link) => {
    addGroup(name, link);
    setIsAdding(false);
  };

  return (
    <main className={styles.groupsPage}>
      <h1>Управління групами</h1>
      
      {!isAdding && (
        <button className={styles.createButton} onClick={() => setIsAdding(true)}>
          <HiPlus />
          Додати групу
        </button>
      )}

      {isAdding && (
        <AddGroupForm onSave={handleAddGroup} onCancel={() => setIsAdding(false)} />
      )}

      <div className={styles.content}>
        {groups.length > 0 ? (
          <div className={styles.groupList}>
            {groups.map(group => (
              <div key={group.id} className={styles.groupItem}>
                <div className={styles.groupInfo}>
                  <p className={styles.groupName}>{group.name}</p>
                  <p className={styles.groupLink}>{group.link}</p>
                </div>
                <div className={styles.groupActions}>
                  <a href={group.link} target="_blank" rel="noopener noreferrer" className={styles.actionButton}>
                    <HiExternalLink />
                  </a>
                  <button className={styles.actionButton} onClick={() => alert('Редагування в розробці')}>
                    <HiOutlinePencil />
                  </button>
                  <button className={`${styles.actionButton} ${styles.deleteButton}`} onClick={() => deleteGroup(group.id)}>
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
            ))}
            <p className={styles.pathInfo}>Шлях до даних: Hr Bot\Data\Groups</p>
          </div>
        ) : (
          !isAdding && <p className={styles.placeholder}>Наразі немає доданих груп</p>
        )}
      </div>
    </main>
  );
}

export default GroupsPage;
