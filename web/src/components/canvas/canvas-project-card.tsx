import { Check, Download, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dropdown, Input } from "antd";
import { useTranslation } from "react-i18next";
import { exportCanvasProjects } from "@/lib/canvas/canvas-export";
import { useCanvasStore, type CanvasProject } from "@/stores/canvas/use-canvas-store";
import { useCanvasUiStore } from "@/stores/canvas/use-canvas-ui-store";
import { CanvasProjectCover } from "./canvas-project-cover";

export function CanvasProjectCard({ project }: { project: CanvasProject }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const renameProject = useCanvasStore((state) => state.renameProject);
    const selectedIds = useCanvasUiStore((state) => state.selectedProjectIds);
    const editingId = useCanvasUiStore((state) => state.editingProjectId);
    const editingTitle = useCanvasUiStore((state) => state.editingProjectTitle);
    const startEditing = useCanvasUiStore((state) => state.startEditingProject);
    const setEditingTitle = useCanvasUiStore((state) => state.setEditingProjectTitle);
    const stopEditing = useCanvasUiStore((state) => state.stopEditingProject);
    const toggleSelected = useCanvasUiStore((state) => state.toggleSelectedProjectId);
    const setDeleteIds = useCanvasUiStore((state) => state.setDeleteProjectIds);
    const editing = editingId === project.id;
    const selected = selectedIds.includes(project.id);
    const open = () => navigate(`/canvas/${project.id}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`);
    const saveTitle = () => {
        if (editingTitle.trim()) renameProject(project.id, editingTitle.trim());
        stopEditing();
    };
    return (
        <article data-canvas-project-card={project.id} className={`yz-project-card group ${selected ? "is-selected" : ""}`}>
            <div className="yz-project-cover">
                <CanvasProjectCover project={project} />
                <img src="/brand/film-edge.webp" alt="" className="yz-film-edge" draggable={false} />
                <img src="/brand/film-edge.webp" alt="" className="yz-film-edge yz-film-edge-right" draggable={false} />
                <button type="button" className="yz-project-open" onClick={open} aria-label={t("canvas.start.openProject", { name: project.title })} />
                <label className={`yz-project-checkbox ${selected ? "is-selected" : ""}`} title={t("canvas.project.select", { name: project.title })}>
                    <input type="checkbox" checked={selected} onChange={(event) => toggleSelected(project.id, event.target.checked)} aria-label={t("canvas.project.select", { name: project.title })} />
                </label>
            </div>
            <div className="yz-project-info">
                {editing ? (
                    <div className="yz-project-rename">
                        <Input
                            value={editingTitle}
                            onChange={(event) => setEditingTitle(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") saveTitle();
                                if (event.key === "Escape") stopEditing();
                            }}
                            aria-label="画布名称"
                            autoFocus
                        />
                        <button type="button" aria-label="保存名称" onClick={saveTitle}>
                            <Check size={17} />
                        </button>
                        <button type="button" aria-label="取消重命名" onClick={stopEditing}>
                            <X size={17} />
                        </button>
                    </div>
                ) : (
                    <>
                        <button type="button" className="yz-project-name" onClick={open} title={project.title}>
                            {project.title}
                        </button>
                        <Dropdown
                            trigger={["click"]}
                            placement="bottomRight"
                            menu={{
                                items: [
                                    { key: "rename", label: "重命名", icon: <Pencil size={15} />, onClick: () => startEditing(project.id, project.title) },
                                    { key: "export", label: "导出画布", icon: <Download size={15} />, onClick: () => void exportCanvasProjects([project], project.title || t("canvas.title")) },
                                    { type: "divider" },
                                    { key: "delete", label: "删除画布", icon: <Trash2 size={15} />, danger: true, onClick: () => setDeleteIds([project.id]) },
                                ],
                            }}
                        >
                            <button type="button" className="yz-project-more" aria-label={`画布操作：${project.title}`}>
                                <MoreHorizontal size={19} />
                            </button>
                        </Dropdown>
                    </>
                )}
            </div>
            <p className="yz-project-caption">
                保存在此设备<span> · {project.nodes.length} 个节点</span>
            </p>
        </article>
    );
}
