import React, { useEffect } from 'react';

interface TutorialProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  totalSteps: number;
  targetRef: React.RefObject<HTMLElement>;
  title: string;
  description: string;
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({
  step,
  setStep,
  totalSteps,
  targetRef,
  title,
  description,
  onClose
}) => {
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Calculate position relative to target element
  const calculatePosition = () => {
    if (!targetRef.current) return { top: 0, left: 0 };

    const rect = targetRef.current.getBoundingClientRect();
    return {
      top: `${rect.bottom + 10}px`,
      left: `${rect.left}px`
    };
  };

  const position = calculatePosition();

  // Create overlay effect
  useEffect(() => {
    // Create overlay effect by adding class to body
    document.body.classList.add('driver-active');

    return () => {
      document.body.classList.remove('driver-active');
    };
  }, []);

  return (
    <>
      {/* Popover */}
      <div
        className="driver-popover"
        id="driver-popover-content"
        role="dialog"
        aria-labelledby="driver-popover-title"
        aria-describedby="driver-popover-description"
        style={{
          display: 'block',
          top: position.top,
          left: position.left
        }}
      >
        <button
          type="button"
          className="driver-popover-close-btn"
          aria-label="Close"
          style={{ display: 'none' }}
          onClick={onClose}
        >
          ×
        </button>

        <div className="driver-popover-arrow driver-popover-arrow-side-left driver-popover-arrow-align-start"></div>

        <header id="driver-popover-title" className="driver-popover-title" style={{ display: 'block' }}>
          {title}
        </header>

        <div id="driver-popover-description" className="driver-popover-description" style={{ display: 'block' }}>
          {description}
        </div>

        <footer className="driver-popover-footer" style={{ display: 'flex' }}>
          <span className="driver-popover-progress-text" style={{ display: 'block' }}>
            {step} of {totalSteps}
          </span>

          <span className="driver-popover-navigation-btns">
            <button
              type="button"
              className={`driver-popover-prev-btn ${step === 1 ? 'driver-popover-btn-disabled' : ''}`}
              disabled={step === 1}
              style={{ display: 'block' }}
              onClick={handlePrev}
            >
              上一个
            </button>

            <button
              type="button"
              className="driver-popover-next-btn"
              style={{ display: 'block' }}
              onClick={handleNext}
            >
              {step < totalSteps ? '下一个' : '完成'}
            </button>
          </span>
        </footer>
      </div>

      {/* Overlay with highlight */}
      <svg
        className="driver-overlay driver-overlay-animated"
        viewBox="0 0 1280 720"
        xmlSpace="preserve"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        preserveAspectRatio="xMinYMin slice"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          strokeLinejoin: 'round',
          strokeMiterlimit: 2,
          zIndex: 10000,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      >
        <path
          d={`M1280,0L0,0L0,720L1280,720L1280,0Z
          M${targetRef.current?.getBoundingClientRect().left || 0},${targetRef.current?.getBoundingClientRect().top || 0}
          h${targetRef.current?.getBoundingClientRect().width || 0}
          a5,5 0 0 1 5,5
          v${targetRef.current?.getBoundingClientRect().height || 0}
          a5,5 0 0 1 -5,5
          h-${targetRef.current?.getBoundingClientRect().width || 0}
          a5,5 0 0 1 -5,-5
          v-${targetRef.current?.getBoundingClientRect().height || 0}
          a5,5 0 0 1 5,-5 z`}
          style={{
            fill: 'rgb(0, 0, 0)',
            opacity: 0.7,
            pointerEvents: 'auto',
            cursor: 'auto'
          }}
        />
      </svg>
    </>
  );
};

export default Tutorial;
