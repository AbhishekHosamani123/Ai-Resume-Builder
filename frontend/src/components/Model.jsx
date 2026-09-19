import React from 'react'
import { modalStyles as styles } from '../assets/dummystyle'
import { X } from 'lucide-react'

const Modal = ({
    children, isOpen, onClose, title, hideHeader, showActionBtn, actionBtnIcon = null,
    actionBtnText, onActionClick = () => { },
    secondaryAction = null, // { icon, label, onClick }
}) => {
    if (!isOpen) return null
    return (
        <div className={styles.overlay} data-lenis-prevent>
            <div className={styles.container}>
                {!hideHeader && (
                    <div className={styles.header}>
                        <h3 className={styles.title}>
                            {title}
                        </h3>
                        {showActionBtn && (
                            <div className="mr-14 flex items-center gap-2">
                                {secondaryAction && (
                                    <button
                                        type="button"
                                        onClick={secondaryAction.onClick}
                                        disabled={secondaryAction.disabled}
                                        className="flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-ink transition-all hover:border-brand-300 hover:text-brand-600 disabled:opacity-60"
                                    >
                                        {secondaryAction.icon}
                                        {secondaryAction.label}
                                    </button>
                                )}
                                <button className={`${styles.actionButton} !mr-0`} onClick={onActionClick}>
                                    {actionBtnIcon}
                                    {actionBtnText}

                                </button>
                            </div>
                        )}

                    </div>
                )}
                <button type="button" className={styles.closeButton} onClick={onClose}>
                    <X size={20}/>
                </button>
                <div className={styles.body} data-lenis-prevent>{children}</div>
            </div>
        </div>
    )
}

export default Modal
