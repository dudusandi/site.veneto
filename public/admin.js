import { auth, db } from './firebase-init.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { ref, onValue, push, set, update, remove } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';


const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const tableBody = document.querySelector('#cardapio-table tbody');
const addBtn = document.getElementById('add-item-btn');

const clearForm = () => {
    document.getElementById('new-nome').value = '';
    document.getElementById('new-desc').value = '';
    document.getElementById('new-preco').value = '';
    document.getElementById('new-img').value = '';
};

loginBtn?.addEventListener('click', async () => {
    loginError.textContent = '';
    try {
        await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    } catch (err) {
        loginError.textContent = 'Credenciais inválidas';
    }
});

logoutBtn?.addEventListener('click', () => signOut(auth));

addBtn?.addEventListener('click', async () => {
    const nome = document.getElementById('new-nome').value.trim();
    const descricao = document.getElementById('new-desc').value.trim();
    const preco = parseFloat(document.getElementById('new-preco').value);
    const imagem = document.getElementById('new-img').value.trim();
    if (!nome || !descricao || isNaN(preco) || !imagem) return alert('Preencha todos os campos');
    const newRef = push(ref(db, 'cardapio'));
    await set(newRef, { nome, descricao, preco, imagem });
    clearForm();
});

const renderTable = (snapshot) => {
    tableBody.innerHTML = '';
    snapshot.forEach(child => {
        const key = child.key;
        const item = child.val();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input value="${item.nome}" class="nome admin-input"></td>
            <td><textarea class="desc admin-textarea">${item.descricao}</textarea></td>
            <td><input type="number" value="${item.preco}" class="preco admin-input" style="max-width:100px"></td>
            <td><input value="${item.imagem}" class="img admin-input"></td>
            <td>
                <button class="salvar admin-btn" data-key="${key}">Salvar</button>
                <button class="excluir admin-btn-del admin-btn" data-key="${key}">Del</button>
            </td>`;
        tableBody.appendChild(tr);
    });
};

// Mostra ou esconde painel baseado na autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'block';
        // Carrega cardápio em tempo real
        const cardRef = ref(db, 'cardapio');
        onValue(cardRef, renderTable);
    } else {
        adminContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    }
});

// Delegação de eventos para Salvar/Excluir
adminContainer?.addEventListener('click', async (e) => {
    const target = e.target;
    if (target.classList.contains('salvar')) {
        const key = target.dataset.key;
        const row = target.closest('tr');
        const data = {
            nome: row.querySelector('.nome').value,
            descricao: row.querySelector('.desc').value,
            preco: parseFloat(row.querySelector('.preco').value),
            imagem: row.querySelector('.img').value
        };
        await update(ref(db, `cardapio/${key}`), data);
    }
    if (target.classList.contains('excluir')) {
        const key = target.dataset.key;
        if (confirm('Confirma excluir?')) {
            await remove(ref(db, `cardapio/${key}`));
        }
    }
}); 