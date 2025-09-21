/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import Modal from './Modal';
import { useUI, useUser } from '@/lib/state';

export default function UserSettings() {
  const { name, info, setName, setInfo } = useUser();
  const { setShowUserConfig } = useUI();

  function updateClient() {
    setShowUserConfig(false);
  }

  return (
    <Modal onClose={() => setShowUserConfig(false)}>
      <div className="userSettings">
        <p>
          Your personalizes therapist that truly cares
        </p>

        <form
          onSubmit={e => {
            e.preventDefault();
            setShowUserConfig(false);
            updateClient();
          }}
        >
          <p>All optional - share what feels right: This stays private and makes chats richer:</p>

          <div>
            Your name
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="What do you like to be called?"
            />
          </div>

          <div>
            Your info
            <textarea
              rows={3}
              value={info}
              onChange={e => setInfo(e.target.value)}
              placeholder="Things we should know about you… Likes, dislikes, hobbies, interests, favorite movies, books, tv shows, foods, etc."
            />
          </div>

          <button className="button primary">Let&apos;s go!</button>
        </form>
      </div>
    </Modal>
  );
}
