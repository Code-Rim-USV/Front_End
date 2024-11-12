<template>

    <div class="login-container">
        <div class="backgorund">
            <div class="backgorund-overlay">
                <div class="login-card">
                    <h2>Welcome to FIESC Panel</h2>
                    <form @submit.prevent="handleLogin">
                        <BaseInput label="Email" type="email" placeholder="prenume.nume@student.usv.ro"
                            v-model="email" />
                        <BaseInput label="Password" type="password" placeholder="Enter your password" v-model="password"
                            :show-toggle="true" />
                        <button type="submit" class="login-button">Login in</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import BaseInput from "@/components/BaseInput.vue";

export default {
    name: "LoginView",
    components: {
        BaseInput,
    },
    data() {
        return {
            email: "",
            password: "",
        };
    },
    methods: {
        handleLogin() {
            // Codul
            console.log("Email:", this.email);
            console.log("Password:", this.password);
        },
    },
};
</script>

<style scoped>
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.backgorund {
    background: url('/src/assets/BackgroundLogin.jpg') center/cover no-repeat;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.backgorund-overlay{
    background-color: rgba(255, 255, 255, 0.8);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;

}

.login-card {
    background-color: white;
    padding: 48px 72px 48px 72px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 540px;
    width: 100%;
    max-height: 412px;
    height: 100%;
    text-align: center;
}

h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: black;
    font-style: bolt;
    font-weight: bold;
}

.login-button {
    width: 100%;
    margin-top: 18px;
    padding: 16px;
    font-size: 1rem;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.login-button:hover {
    background-color: #0056b3;
}
</style>