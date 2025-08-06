import React, { useState } from 'react';
import styles from './VacanciesPage.module.css';
import { useAppContext } from '../context/AppContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { HiPlus, HiChevronDown, HiChevronUp, HiPencil, HiTrash } from 'react-icons/hi';

// --- Універсальна форма для редагування/створення ---
const EntityForm = ({ entity = {}, onSave, onCancel, type }) => {
  const [name, setName] = useState(entity.name || '');
  const [description, setDescription] = useState(entity.description || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'agency') onSave({ name });
    if (type === 'vacancy') onSave({ name, description });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>Назва {type === 'agency' ? 'агенції' : 'вакансії'}:</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} autoFocus />
      {type === 'vacancy' && (
        <>
          <label>Опис вакансії:</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </>
      )}
      <div className={styles.formActions}>
        <button type="submit">Зберегти</button>
        <button type="button" onClick={onCancel}>Відмінити</button>
      </div>
    </form>
  );
};

// --- Компонент для однієї агенції (акордеон) ---
const AgencyItem = ({ agency, onEdit, onDelete }) => {
  const { addVacancy, editVacancy, deleteVacancy } = useAppContext();
  const [isOpen, setIsOpen] = useState(true);
  const [editingState, setEditingState] = useState(null); // null | { type: 'vacancy', id: vacancyId }

  const handleSaveVacancy = (data) => {
    if (editingState && editingState.type === 'vacancy' && editingState.id) {
      // Редагування існуючої
      editVacancy(agency.id, editingState.id, data.name, data.description);
    } else {
      // Створення нової
      addVacancy(agency.id, data.name, data.description);
    }
    setEditingState(null);
  };

  return (
    <div className={styles.agencyItem}>
      <header className={styles.agencyHeader}>
        <div className={styles.agencyName} onClick={() => setIsOpen(!isOpen)}>
          {agency.name}
          <span className={styles.chevronIcon}>{isOpen ? <HiChevronUp /> : <HiChevronDown />}</span>
        </div>
        <div className={styles.agencyMeta}>
          <span>Вакансій: {agency.vacancies.length}</span>
          <div className={styles.itemActions}>
            <button onClick={() => onEdit(agency)}><HiPencil /></button>
            <button onClick={() => onDelete(agency)}><HiTrash /></button>
          </div>
        </div>
      </header>
      {isOpen && (
        <div className={styles.agencyBody}>
          {agency.vacancies.map(vac => (
            editingState && editingState.type === 'vacancy' && editingState.id === vac.id ? (
              <EntityForm key={vac.id} entity={vac} type="vacancy" onSave={handleSaveVacancy} onCancel={() => setEditingState(null)} />
            ) : (
              <div key={vac.id} className={styles.vacancyItem}>
                <div>
                  <p className={styles.vacancyName}>{vac.name}</p>
                  <p className={styles.vacancyDesc}>{vac.description}</p>
                </div>
                <div className={styles.itemActions}>
                  <button onClick={() => setEditingState({ type: 'vacancy', id: vac.id })}><HiPencil /></button>
                  <button onClick={() => onDelete(agency, vac)}><HiTrash /></button>
                </div>
              </div>
            )
          ))}
          {editingState && editingState.type === 'vacancy' && !editingState.id ? (
            <EntityForm type="vacancy" onSave={handleSaveVacancy} onCancel={() => setEditingState(null)} />
          ) : (
            <button className={styles.addVacancyButton} onClick={() => setEditingState({ type: 'vacancy', id: null })}>
              <HiPlus /> Створити вакансію
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// --- Основний компонент сторінки ---
function VacanciesPage() {
  const { agencies, addAgency, editAgency, deleteAgency, deleteVacancy } = useAppContext();
  const [editingState, setEditingState] = useState(null); // null | { type: 'agency', id: agencyId }
  const [modalState, setModalState] = useState({ isOpen: false, data: null });

  const handleSaveAgency = (data) => {
    if (editingState && editingState.id) {
      editAgency(editingState.id, data.name);
    } else {
      addAgency(data.name);
    }
    setEditingState(null);
  };

  const openDeleteModal = (agency, vacancy = null) => {
    setModalState({ isOpen: true, data: { agency, vacancy } });
  };

  const handleConfirmDelete = () => {
    const { agency, vacancy } = modalState.data;
    if (vacancy) {
      deleteVacancy(agency.id, vacancy.id);
    } else {
      deleteAgency(agency.id);
    }
    setModalState({ isOpen: false, data: null });
  };

  const getModalMessage = () => {
    if (!modalState.data) return "";
    const { vacancy } = modalState.data;
    return `Ви точно хочете видалити ${vacancy ? `вакансію "${vacancy.name}"` : `агенцію "${modalState.data.agency.name}" та всі її вакансії`}?`;
  };

  return (
    <>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, data: null })}
        onConfirm={handleConfirmDelete}
        message={getModalMessage()}
      />
      <main className={styles.vacanciesPage}>
        <h1>Управління вакансіями</h1>
        
        {!editingState && (
          <button className={styles.createButton} onClick={() => setEditingState({ type: 'agency', id: null })}>
            <HiPlus /> Створити агенцію
          </button>
        )}

        {editingState && editingState.type === 'agency' && (
          <EntityForm 
            entity={agencies.find(a => a.id === editingState.id)}
            type="agency" 
            onSave={handleSaveAgency} 
            onCancel={() => setEditingState(null)} 
          />
        )}

        <div className={styles.content}>
          {agencies.length > 0 ? (
            agencies.map(agency => 
              editingState && editingState.type === 'agency' && editingState.id === agency.id ? null : (
                <AgencyItem 
                  key={agency.id} 
                  agency={agency} 
                  onEdit={() => setEditingState({ type: 'agency', id: agency.id })}
                  onDelete={openDeleteModal}
                />
              )
            )
          ) : (
            !editingState && <p className={styles.placeholder}>Наразі немає створених агенцій</p>
          )}
        </div>
      </main>
    </>
  );
}

export default VacanciesPage;
