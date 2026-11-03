<script setup>
</script>

<template>
    <section class="dashboard-menu">
        
        <h2>Meus Cards</h2>

        <NuxtLink class="dashboard-menu-link" to="/form">+ Criar Novo Card</NuxtLink>

    </section>
</template>

<style scoped>
.dashboard-menu {
    display: flex;
    width: 100%;
    align-items: center;
}

.dashboard-menu-link {
    margin-left: auto;
    padding: 0.5rem 1rem;
    border-radius: var(--b-radius);
    background: var(--fuchsia-red);
    color: var(--white);
    font-weight: 600;
    text-decoration: none;
}

.dashboard-menu-link:hover {
    background: #f7234a;
}
</style>
