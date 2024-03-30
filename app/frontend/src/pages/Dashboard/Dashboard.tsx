import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { User } from '../../types/UserTypes';
import ApiService from '../../services/UserService';
import { FaGithub, FaLinkedinIn, FaSearch } from 'react-icons/fa';
import IconEdit from '../../assets/images/iconEdit.svg';
import IconDelete from '../../assets/images/iconDelete.svg';
import NavBarSide from '../../components/NavBar/NavBarSide';
import {
  Container,
  Header,
  Icons,
  Main, NotFound, Search, Section, SectionTable, Table, Title } from './Style';


export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [editedRole, setEditedRole] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  useEffect(() => {
    const handleFetch = async () => {
      try {
        const response = await ApiService.getUsers();
        setUsers(response.data);
        setAllUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    handleFetch();
  }, []);

  const handleSearch = async (search: string) => {
    try {
      const searchResult = allUsers.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase()));
      setUsers(searchResult);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const handleEdit = (id: number, role: string) => {
    setEditingId(id);
    setEditedRole(role);
  };

  const handleUpdate = async (id: number) => {
    try {
      await ApiService.updateUser(id, { role: editedRole } as User);
      const updatedUsers = users.map((user) => {
        if (+user.id === id) {
          return { ...user, role: editedRole };
        }
        return user;
      });
      setUsers(updatedUsers);
      setEditingId(null);
      Swal.fire({
        icon: 'success',
        title: 'User updated successfully',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await handleSwalDelete();

    if (!result.isConfirmed) return;

    try {
      await ApiService.deleteUser(id);
      const deletedUser = users.filter((user) => +user.id !== id);
      setUsers(deletedUser);
      Swal.fire({
        icon: 'success',
        title: 'User deleted successfully',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleSwalDelete = () => {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    setUsers([]);
    navigate('/');
  };

  return (
    <Container>
      <Main>
        <NavBarSide user={ user } handleLogout={ handleLogout } />
        <Section>
          <Header>
            <Title>
              <h1>Dashboard</h1>
            </Title>
            <Search>
              <input
                type="text"
                placeholder="Search"
                onChange={ (e) => handleSearch(e.target.value) }
              />
              <FaSearch size={ 25 } />
            </Search>
            <Icons>
              <FaLinkedinIn size={ 25 } />
              <FaGithub size={ 25 } />
            </Icons>
          </Header>
          <SectionTable>
            <Table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: User) => (
                  <tr key={ user.id }>
                    <td><img src={ user.image } alt={ user.username } /></td>
                    <td>{ user.username }</td>
                    <td>
                    {editingId === +user.id ? (
                      <input 
                        type="text" 
                        value={editedRole} 
                        onChange={(e) => setEditedRole(e.target.value)} 
                      />
                    ) : (
                      user.role
                    )}
                    </td>
                    <td>{ user.email }</td>
                    <td>
                    <button
                      onClick={ () => editingId === +user.id ?
                        handleUpdate(+user.id) : handleEdit(+user.id, user.role) }
                    >
                      <img src={ editingId === +user.id ? IconEdit : IconEdit } alt="Edit" />
                    </button>
                    </td>
                    <td>
                      <button
                        onClick = { () => handleDelete(+user.id) }
                      >
                        <img src={ IconDelete } alt="Delete" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <NotFound>
              {loading ?
                <h1>Loading...</h1>
                : users.length === 0 && <h1>No users found</h1>
              }
            </NotFound>
          </SectionTable>
        </Section>
      </Main>
    </Container>
  );
}