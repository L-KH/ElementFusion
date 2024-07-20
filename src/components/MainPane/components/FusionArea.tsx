import React from 'react';
import styles from '../../../styles/Home.module.css';

const FusionArea = ({ selectedElements, onElementRemove, result }) => {
  return (
    <div className={styles.fusionArea}>
      <h2>Fusion Area</h2>
      <div className={`${styles.fusionBox} ${result && !result.success ? styles.invalid : ''}`}>
        {selectedElements[0] ? (
          <div className={styles.fusionElement} onClick={() => onElementRemove(0)}>
            <img src={selectedElements[0].imagePath} alt={selectedElements[0].name} />
          </div>
        ) : (
          <div className={styles.emptyBox}></div>
        )}
        <div className={styles.fusionSign}>+</div>
        {selectedElements[1] ? (
          <div className={styles.fusionElement} onClick={() => onElementRemove(1)}>
            <img src={selectedElements[1].imagePath} alt={selectedElements[1].name} />
          </div>
        ) : (
          <div className={styles.emptyBox}></div>
        )}
        <div className={styles.fusionSign}>=</div>
        <div className={styles.fusionElement}>
          {result && result.success ? (
            <img src={result.element.imagePath} alt={result.element.name} />
          ) : result && !result.success ? (
            <span className={styles.invalidSign}>X</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FusionArea;