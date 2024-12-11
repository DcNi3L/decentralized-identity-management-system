import { useEffect, useState } from 'react';
import { web3, contract } from '../../lib/web3';
import Header from '../components/Header';
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';
import { FaRegPenToSquare } from "react-icons/fa6";

const Profile = () => {
  const [account, setAccount] = useState('');
  const [identity, setIdentity] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProfileImage(localStorage.getItem('profileImage') || null);
    }
  }, []);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    setAccount(accounts[0]);
  };

  const fetchProfile = async () => {
    try {
      const result = await contract.methods.getIdentity(account).call();
      setIdentity({
        name: result[0],
        email: result[1],
        profileImage: result[2],
      });
      if (!profileImage && typeof window !== 'undefined') {
        setProfileImage(result[2]);
        localStorage.setItem('profileImage', result[2]);
      }
    } catch (err) {
      console.log('Error fetching profile:', err);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const applyCrop = async () => {
    if (croppedAreaPixels && profileImage) {
      const croppedImage = await getCroppedImg(profileImage, croppedAreaPixels);
      setProfileImage(croppedImage);
      localStorage.setItem('profileImage', croppedImage);
      setIsCropModalOpen(false);
    }
  };

  const getCroppedImg = (imageSrc, pixelCrop) => {
    const canvas = document.createElement('canvas');
    const image = new Image();
    image.src = imageSrc;
    return new Promise((resolve) => {
      image.onload = () => {
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  };

  const handleUpdateProfile = async () => {
    try {
      if (!updatedName || !updatedEmail) {
        alert('Name and email cannot be empty.');
        return;
      }

      await contract.methods
        .updateIdentity(updatedName, updatedEmail, profileImage)
        .send({ from: account });
      alert('Profile updated successfully!');
      fetchProfile();
      setIsUpdateModalOpen(false);
    } catch (err) {
      console.log('Error updating profile:', err);
    }
  };

  const deleteProfile = async () => {
    try {
      const confirmDelete = confirm('Are you sure you want to delete your profile?');
      if (!confirmDelete) return;

      await contract.methods.deleteIdentity().send({ from: account });
      alert('Profile deleted successfully!');
      setIdentity({});
      setProfileImage(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('profileImage');
      }
    } catch (err) {
      console.log('Error deleting profile:', err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (account) fetchProfile();
  }, [account]);

  return (
    <div className="min-h-screen bg-gray-100">
      <title>Profile</title>
      <Header />
      <div className="max-w-4xl mx-auto py-10 px-5">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Profile</h1>
        {identity.name ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-center mb-4">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-64 h-64 rounded-full mx-auto mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4"></div>
              )}
              <div className="flex justify-center items-center -translate-y-14 translate-x-16">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex justify-center items-center text-black w-10 h-10 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400"
                >
                  <FaRegPenToSquare/>
                </label>
              </div>

              <h2 className="text-xl font-semibold text-gray-700 mt-4">{identity.name}</h2>
              <p className="text-gray-500">{identity.email}</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <span className="text-black truncate text-md">Wallet address:</span>
              <span className="text-gray-700 text-sm truncate w-max">{account}</span>
            </div>
            <div className="flex justify-center items-center mt-4">
              <button
                onClick={() => {
                  setUpdatedName(identity.name);
                  setUpdatedEmail(identity.email);
                  setIsUpdateModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 delay-125 linear text-white rounded-lg mr-10"
              >
                Update Profile
              </button>
              <button
                onClick={deleteProfile}
                className="px-4 py-2 bg-red-500 hover:bg-red-700 delay-125 linear text-white rounded-lg"
              >
                Delete Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-gray-500">Fetching profile data...</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        contentLabel="Update Profile Modal"
        className="bg-white text-black rounded-lg shadow-lg max-w-md mx-auto mt-[13%] p-6"
        overlayClassName="bg-black bg-opacity-50 fixed inset-0"
      >
        <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleUpdateProfile}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 linear delay-125 text-white rounded-lg mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setIsUpdateModalOpen(false)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 delay-125 linear text-gray-700 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isCropModalOpen}
        onRequestClose={() => setIsCropModalOpen(false)}
        contentLabel="Crop Image"
        style={{
          content: {
            width: '800px',
            height: '650px',
            margin: 'auto',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column-reverse',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        <div className="crop-container">
          <Cropper
            image={profileImage}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex justify-end translate-y-1">
          <button
            onClick={applyCrop}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
          >
            Apply
          </button>
          <button
            onClick={() => setIsCropModalOpen(false)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg ml-2"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
