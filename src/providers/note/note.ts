import { Injectable } from '@angular/core';
import {ApiProvider} from "../api/api";

@Injectable()
export class NoteProvider {

  /**
   * Constructor
   * @param {ApiProvider} api
   */
  constructor(public api: ApiProvider) {}

  /**
   * Liste de toutes les notes pour un utilisateur (ID)
   *
   * @param id
   * @returns {Observable<ArrayBuffer>}
   */
  getNotesByUserId(id) {
    return this.api.get('users/' + id);
  }

  /**
   * GET d'une note par son ID
   *
   * @param id
   * @returns {Observable<ArrayBuffer>}
   */
  getNoteById(id) {
    return this.api.get('note/' + id);
  }

  /**
   * Liste de toutes les notes
   *
   * @returns {Observable<ArrayBuffer>}
   */
  getAllNotes() {
    return this.api.get('notes');
  }

  /**
   * DELETE (suppression) d'une note selon son ID
   *
   * @param id
   * @returns {Observable<Object>}
   */
  delete(id) {
    return this.api.delete('note/' + id, {});
  }

  /**
   * Sauvegarde d'une note
   *
   * @param {string} type
   * @param body
   * @param {number} id
   * @returns {Observable<Object>}
   */
  send(type: string = 'post', body, id ?: number) {
    if( type === 'post' ) {
      return this.post(body);
    }

    return this.put(id, body);
  }

  /**
   * POST (Création) d'une nouvelle note
   *
   * @param body
   * @returns {Observable<Object>}
   */
  post(body) {
    return this.api.post('note', body);
  }

  /**
   * PUT (MAJ) d'une note
   *
   * @param id
   * @param body
   * @returns {Observable<Object>}
   */
  put(id, body) {
    return this.api.post('note/' + id, body)
  }

}
