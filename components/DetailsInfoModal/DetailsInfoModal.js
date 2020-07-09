import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uploadcare from 'uploadcare-widget';
import ExperienceDetailsInfo from 'components/ExperienceDetailsInfo/ExperienceDetailsInfo';
import PrevNextButtons from 'components/PrevNextButtons/PrevNextButtons';
import Modal from 'components/Modal/Modal';
import styles from './DetailsInfoModalStyles.scss';

class DetailsInfoModal extends Component {
  constructor() {
    super();
    this.state = {
      catalogImages: [],
      parsedImages: false,
      isModalWishlisted: false
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentDidUpdate(prevProps) {
    const {
      catalogDetailImagesUrl: prevImages,
      wishlistTotalCount: wishlistTotalCountPrev
    } = prevProps;
    const {
      catalogDetailImagesUrl,
      wishlistTotalCount,
      isWishlisted,
      infoId
    } = this.props;
    if (
      prevImages !== catalogDetailImagesUrl &&
      catalogDetailImagesUrl !== undefined
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ catalogImages: [], parsedImages: false });
      this.parseCatalogDetailImages(catalogDetailImagesUrl);
    }
    if (wishlistTotalCountPrev !== wishlistTotalCount) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isModalWishlisted: isWishlisted(infoId) });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = event => {
    if (event.keyCode === 39) {
      this.onNextPrevButtonClick('next');
    }
    if (event.keyCode === 37) {
      this.onNextPrevButtonClick('prev');
    }
  };

  parseCatalogDetailImages = catalogDetailImagesUrl => {
    uploadcare
      .loadFileGroup(catalogDetailImagesUrl)
      .done(fileGroup => {
        const arrayOfFiles = fileGroup.files();
        let uploadDataParsed = [];
        arrayOfFiles.forEach(file => {
          file.done(({ cdnUrl }) => {
            uploadDataParsed = [...uploadDataParsed, cdnUrl];
          });
        });
        this.setState({
          catalogImages: uploadDataParsed,
          parsedImages: true
        });
      })
      .fail(() => {
        // eslint-disable-next-line no-console
        console.log('failed to load uploadcare images');
      });
  };

  onNextPrevButtonClick = buttonType => {
    const { onFetchInfoDetails, infosIds, infoId, isWishlisted } = this.props;
    const { iterator } = Symbol;
    // eslint-disable-next-line func-names
    infosIds[iterator] = function() {
      let index = this.indexOf(infoId);
      return {
        next: () => {
          const done = index >= this.length;
          // eslint-disable-next-line no-plusplus
          const value = done ? undefined : this[++index];
          return { value, done };
        },
        prev: () => {
          const done = index === 0;
          // eslint-disable-next-line no-plusplus
          const value = done ? undefined : this[--index];
          return { value, done };
        }
      };
    };
    const iterableData = infosIds[iterator]();
    const iterableAction =
      buttonType === 'next' ? iterableData.next() : iterableData.prev();
    const { value: id } = iterableAction;
    if (id) {
      onFetchInfoDetails(id, 'offeringId');
      this.setState({ isModalWishlisted: isWishlisted(id) });
    }
  };

  render() {
    const {
      infoId,
      infoCategory,
      duration,
      groupSize,
      location,
      subDescription,
      wishlistTotalCount,
      isDetailsModalOpen,
      onModalClose,
      isWishlisted,
      onWishlistIconClick,
      infoDetailsReceived,
      infosIds,
      showCategory,
      ...restProps
    } = this.props;
    const { catalogImages, parsedImages, isModalWishlisted } = this.state;
    const dataReceived = parsedImages || infoDetailsReceived;
    return (
      <Modal
        showCloseIcon={false}
        isOpen={isDetailsModalOpen}
        onModalClose={onModalClose}
        className={styles.modalStyle}
        modalBodyCustomClass={styles.modalBodyWrap}
      >
        <PrevNextButtons
          onNextClick={() => this.onNextPrevButtonClick('next')}
          onPrevClick={() => this.onNextPrevButtonClick('prev')}
        />
        <ExperienceDetailsInfo
          doNotShowCategory={showCategory}
          infoCategory={infoCategory}
          duration={duration}
          groupSize={groupSize}
          location={location}
          subDescription={subDescription}
          customHolderClassName={styles.holder}
          customDetailsHolderClassName={styles.detailsHolder}
          customInfoPictureClassName={styles.infoPicture}
          customCarouselHolderClassName={styles.carouselHolder}
          catalogImages={catalogImages}
          parsedImages={parsedImages}
          isWishlisted={isWishlisted(infoId) || isModalWishlisted}
          onWishlistIconClick={event => onWishlistIconClick(event, infoId)}
          dataReceived={dataReceived}
          {...restProps}
        />
      </Modal>
    );
  }
}

DetailsInfoModal.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  onFetchInfoDetails: PropTypes.func.isRequired,
  onWishlistIconClick: PropTypes.func.isRequired,
  isWishlisted: PropTypes.func.isRequired,
  infoId: PropTypes.number,
  showCategory: PropTypes.bool.isRequired,
  isDetailsModalOpen: PropTypes.bool.isRequired,
  infoDetailsReceived: PropTypes.bool,
  infosIds: PropTypes.arrayOf(PropTypes.number),
  wishlistTotalCount: PropTypes.number,
  catalogDetailImagesUrl: PropTypes.string,
  infoCategory: PropTypes.string,
  duration: PropTypes.string,
  groupSize: PropTypes.number,
  location: PropTypes.string,
  subDescription: PropTypes.node
};

DetailsInfoModal.defaultProps = {
  infoId: 1,
  catalogDetailImagesUrl: '',
  wishlistTotalCount: null,
  infoDetailsReceived: false,
  infosIds: [],
  infoCategory: 'Active',
  duration: '',
  groupSize: 0,
  location: '',
  subDescription: ''
};

export default DetailsInfoModal;
