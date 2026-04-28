<script>
import { UserService } from '../../services/user.service.js';

/**
 * AdminPanelComponent component.
 * @displayName AdminPanelComponent
 * @version 1.0.0
 */
export default {
  name: "AdminPanelComponent",
  data() {
    return {
      maxUsers: 0,
      totalUsers: 0,
      activeFilter: "All",
      filters: ["All", "Admin", "Employee"],
      users: [],
      isLoading: true,
    };
  },
  computed: {
    isFull() {

      return this.maxUsers > 0 && this.totalUsers >= this.maxUsers;
    },
    filteredUsers() {
      if (this.activeFilter === "All") return this.users;
      return this.users.filter((u) => u.role === this.activeFilter);
    },
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    /**
     * fetchUsers
     * @param {any} role = "All"
     * @public
     */
    async fetchUsers(role = "All") {
      this.isLoading = true;
      try {
        const accountId = localStorage.getItem('accountId');
        if (!accountId) return;
        const response = await UserService.getAccountUsers(accountId, role);
        const data = response.data;
        const usersArray = Array.isArray(data) ? data : (data?.users || []);

        this.users = usersArray.map(u => ({
          ...u,
          id: u.userId ?? u.id,
          name: u.fullName ?? u.name ?? u.email,
        }));
        this.totalUsers = data?.totalUsers ?? this.users.length;
        this.maxUsers = data?.maxUsersAllowed ?? 0;
      } catch (err) {
        /**
         * if
         * @param {any} err?.response?.status !== 404
         * @public
         */
        if (err?.response?.status !== 404) {
          console.error('Error fetching users:', err);
        }
        this.users = [];
      } finally {
        this.isLoading = false;
      }
    },
    async setFilter(filter) {
      this.activeFilter = filter;
      await this.fetchUsers(filter);
    },
    addUser() {
      if (this.isFull) return;
      this.$router.push('/admin-panel/create');
    },
    async deleteUser(userId, profileId) {
      if (!confirm("¿Estás seguro que deseas retirar este permiso de acceso?")) return;
      try {
        await UserService.deleteUser(userId, profileId);
        await this.fetchUsers(this.activeFilter);
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('No se pudo eliminar el usuario.');
      }
    },
    editUser(id) {
      this.$router.push('/admin-panel/edit/' + id);
    },
    viewDetails(id) {
      this.$router.push('/admin-panel/view/' + id);
    },
  },
};
</script>

<template>
  <div class="admin-panel-container web-layout">
    <div class="content-wrapper">
      
      <header class="web-header">
        <div class="header-titles">
          <h1 class="page-title">{{ $t('admin.title') }}</h1>
          <p class="page-subtitle">
            {{ $t('admin.subtitle') }}
          </p>
        </div>
      </header>

      
      <div class="admin-dashboard-toolbar">
        
        <div class="capacity-block glass-panel">
          <div class="cap-text-area">
            <span class="cap-title">{{ $t('admin.user_count') }}</span>
            <span class="cap-count">{{ users.length }}/{{ maxUsers > 0 ? maxUsers : '∞' }}</span>
          </div>
          
          <span class="cap-status" :class="{ 'status-full': isFull }">
            {{ isFull ? $t('admin.limit_reached') : $t('common.available') }}
          </span>
        </div>

        
        <div class="action-filters-block glass-panel">
          <div class="filters-pill-group">
            <button
              v-for="filter in filters"
              :key="filter"
              class="filter-pill"
              :class="{ active: activeFilter === filter }"
              @click="setFilter(filter)"
            >
              
              {{ filter === "Administrador" ? "Administr" : filter }}
            </button>
          </div>

          
          <button
            class="add-user-btn"
            :disabled="isFull"
            @click="addUser"
            :class="{ 'btn-disabled': isFull }"
            :title="isFull ? $t('admin.limit_reached') : $t('admin.new_user')"
          >
            <svg viewBox="0 0 24 24" class="plus-icon">
              <path
                fill="currentColor"
                d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
              />
            </svg>
            <span class="btn-text">{{ $t('common.new') }}</span>
          </button>
        </div>
      </div>

      
      <div class="users-grid">
        <div
          class="user-card glass-panel"
          v-for="user in filteredUsers"
          :key="user.id"
        >
          
          <div class="online-indicator"></div>

          <div class="card-left">
            <div class="avatar-circle">
              
              <svg viewBox="0 0 24 24" class="avatar-icon">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                />
              </svg>
            </div>
            <div class="user-info">
              <h3 class="u-name">{{ user.name }}</h3>
              <p class="u-email">{{ user.email }}</p>
            </div>
          </div>

          <div class="card-right">
            
            <span class="role-chip">{{
              user.role === "Administrador" ? "Admin" : user.role
            }}</span>

            <div class="action-icons-group">
              
              <button
                class="action-icon-btn view-btn"
                @click="viewDetails(user.id)"
                title="Ver detalles"
              >
                
                <svg viewBox="0 0 24 24" class="action-icon">
                  <path
                    fill="currentColor"
                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                  />
                </svg>
              </button>

              
              <button
                class="delete-icon-btn"
                @click="deleteUser(user.id, user.profileId)"
                title="Revocar usuario"
              >
                <svg viewBox="0 0 24 24" class="trash-icon">
                  <path
                    fill="currentColor"
                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-panel-container {
  --top-bg: #2b000d; 
  --bottom-bg: #f4ecec; 
  --accent-red: #e02020; 
  --button-dark: #351421; 
  --white: #ffffff;

  --glass-bg: rgba(255, 255, 255, 0.95);
  --glass-border: rgba(43, 0, 13, 0.08);
  --text-primary: rgba(43, 0, 13, 0.9);
  --text-secondary: rgba(0, 0, 0, 0.5);

  padding: 40px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--bottom-bg);
  background:
    radial-gradient(
      circle at top right,
      rgba(229, 62, 62, 0.03),
      transparent 50%
    ),
    var(--bottom-bg);
  animation: fadeIn 0.4s ease-out;
}

.content-wrapper {
  max-width: 1050px;
  margin: 0 auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


.web-header {
  margin-bottom: 30px;
}

.header-titles {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--top-bg);
  margin: 0 0 6px;
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 0;
  font-size: 15px;
  color: var(--text-secondary);
}


.glass-panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: 0 12px 30px rgba(43, 0, 13, 0.05);
  border-radius: 20px;
}


.admin-dashboard-toolbar {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
}


.capacity-block {
  flex: 0 0 350px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  
  background: #ebe0e0;
  border-radius: 20px;
  border: none; 
}

.cap-text-area {
  display: flex;
  flex-direction: column;
}

.cap-title {
  font-size: 14px;
  font-weight: 800;
  color: #4a2833;
  margin-bottom: 4px;
}

.cap-count {
  font-size: 26px;
  font-weight: 800;
  color: #4a2833;
}

.cap-status {
  font-size: 15px;
  font-weight: 800;
  color: #3b8e4e; 
  transition: color 0.3s ease;
}


.cap-status.status-full {
  color: #d13232;
}


.action-filters-block {
  flex: 1;
  display: flex;
  background: transparent;
  box-shadow: none;
  border: none;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
}

.filters-pill-group {
  display: flex;
  gap: 12px;
  background: transparent;
}

.filter-pill {
  padding: 12px 24px;
  border-radius: 30px;
  background: var(--white);
  border: 1px solid rgba(43, 0, 13, 0.1);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.filter-pill:hover {
  background: #faf7f8;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
}

.filter-pill.active {
  
  border-color: rgba(43, 0, 13, 0.4);
}


.add-user-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--button-dark);
  color: var(--white);
  padding: 14px 28px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(53, 20, 33, 0.4);
  transition: all 0.3s ease;
  height: auto;
}

.add-user-btn:hover:not(.btn-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(53, 20, 33, 0.5);
  background: var(--top-bg);
}


.add-user-btn.btn-disabled {
  background: #a39599; 
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
  opacity: 0.8;
}

.plus-icon {
  width: 20px;
  height: 20px;
}

.btn-text {
  font-weight: 800;
  font-size: 15px;
  margin-left: 6px;
}


.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-radius: 20px;
  background: var(--white);
  position: relative;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(43, 0, 13, 0.1);
}


.online-indicator {
  position: absolute;
  bottom: 24px;
  left: 20px;
  width: 12px;
  height: 12px;
  background-color: #dfdcd9;
  border-radius: 50%;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-circle {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background-color: #c0b9ba; 
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  width: 70px;
  height: 70px;
  color: var(--white);
  margin-top: 8px; 
}

.user-info {
  display: flex;
  flex-direction: column;
}

.u-name {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 800;
  color: #3b1923; 
}

.u-email {
  margin: 0;
  font-size: 14px;
  color: #928a8d; 
  font-weight: 500;
}

.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

.role-chip {
  background: #dfd8da;
  color: #482f37;
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}


.action-icons-group {
  display: flex;
  gap: 4px;
}

.action-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon {
  width: 22px;
  height: 22px;
}


.view-btn {
  color: #687b8f;
}
.view-btn:hover {
  background: rgba(104, 123, 143, 0.1);
  transform: scale(1.1);
}


.edit-btn {
  color: #a8945a;
}
.edit-btn:hover {
  background: rgba(168, 148, 90, 0.1);
  transform: scale(1.1);
}


.delete-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--accent-red);
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon-btn:hover {
  background: rgba(224, 32, 32, 0.1);
  transform: scale(1.1);
}

.trash-icon {
  width: 22px;
  height: 22px;
}


@media (max-width: 950px) {
  .admin-dashboard-toolbar {
    flex-direction: column;
  }
  .capacity-block {
    flex: none;
    width: 100%;
  }
  .action-filters-block {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

@media (max-width: 600px) {
  .admin-panel-container {
    padding: 20px 16px;
  }
  .filters-pill-group {
    flex-wrap: wrap;
  }
  .add-user-btn {
    width: 100%;
  }
  .users-grid {
    grid-template-columns: 1fr;
  }
}
</style>
