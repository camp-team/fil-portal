import * as functions from 'firebase-functions';
import { Algolia } from './utils/algolia';

const algolia = new Algolia();

export const createArticle = functions
  .region('asia-northeast1')
  .firestore.document('articles/{articleId}')
  .onCreate((snap) => {
    const data = snap.data();
    return algolia.saveRecord({
      indexName: 'articles',
      largeConcentKey: 'body',
      data,
    });
  });

export const deleteArticle = functions
  .region('asia-northeast1')
  .firestore.document('articles/{articleId}')
  .onDelete((snap) => {
    const data = snap.data();

    if (data) {
      return algolia.removeRecord('articles', data.articleId);
    } else {
      return;
    }
  });

export const updateArticle = functions
  .region('asia-northeast1')
  .firestore.document('articles/{articleId}')
  .onUpdate((change) => {
    const data = change.after.data();
    return algolia.saveRecord({
      indexName: 'articles',
      largeConcentKey: 'body',
      isUpdate: true,
      data,
    });
  });
