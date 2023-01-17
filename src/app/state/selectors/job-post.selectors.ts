import { createSelector, createFeatureSelector } from "@ngrx/store";
import { AppState, filterConditions } from "src/app/model/typescriptModel/job-post-model/jobPost.model";

// export const state = createFeatureSelector<AppState>("jobpost")

export const selectJobPost = createSelector(
  (state: AppState) => state.JobPosts,
  (JobPosts: Array<filterConditions>) => JobPosts
);
export const selectLoading = createSelector(
  (state: AppState) => state.loading,
);

// export const selectBookCollection = createSelector(
//   selectBooks,
//   selectCollectionState,
//   (books: Array<any>, collection: Array<string>) => {
//     return collection.map((id) => books.find((book) => book.id === id));
//   }
// );


/*
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://github.com/ngrx/platform
*/