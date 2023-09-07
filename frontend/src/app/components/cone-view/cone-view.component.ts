import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ConeService } from 'src/app/cone.service';
import { Triangulation } from 'src/app/types.model';
import * as THREE from 'three';

@Component({
  selector: 'app-cone-view',
  templateUrl: './cone-view.component.html',
  styleUrls: ['./cone-view.component.scss'],
})
export class ConeViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  public canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private cone: THREE.Mesh | null = null;

  private destroy$ = new Subject<void>();

  constructor(private coneService: ConeService) {}

  ngOnInit(): void {
    this.coneService.triangulations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateCone();
      });
  }

  ngAfterViewInit(): void {
    this.initThree();
  }

  private updateCone(): void {
    if (this.scene && this.cone) {
      this.scene.remove(this.cone);
      this.createCone();
      this.scene.add(this.cone);
    }
  }

  private createCone = () => {
    const geometry = new THREE.BufferGeometry();
    const triangulations: Triangulation[] = this.coneService.triangulations;

    const positions = new Float32Array(triangulations.length * 9);
    const normals = new Float32Array(triangulations.length * 9);

    for (let i = 0; i < triangulations.length; i++) {
      const triangle = triangulations[i];
      positions[i * 9] = triangle.vertexA.x;
      positions[i * 9 + 1] = triangle.vertexA.y;
      positions[i * 9 + 2] = triangle.vertexA.z;

      positions[i * 9 + 3] = triangle.p1.x;
      positions[i * 9 + 4] = triangle.p1.y;
      positions[i * 9 + 5] = triangle.p1.z;

      positions[i * 9 + 6] = triangle.p2.x;
      positions[i * 9 + 7] = triangle.p2.y;
      positions[i * 9 + 8] = triangle.p2.z;

      const normal = triangle.normal;

      normals[i * 9] = normal.x;
      normals[i * 9 + 1] = normal.y;
      normals[i * 9 + 2] = normal.z;

      normals[i * 9 + 3] = normal.x;
      normals[i * 9 + 4] = normal.y;
      normals[i * 9 + 5] = normal.z;

      normals[i * 9 + 6] = normal.x;
      normals[i * 9 + 7] = normal.y;
      normals[i * 9 + 8] = normal.z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

    const material = new THREE.MeshPhongMaterial({
      color: 0x6e6e6e,
      shininess: 100,
      specular: 0xffffff,
    });

    if (this.cone) {
      this.scene?.remove(this.cone);
    }

    this.cone = new THREE.Mesh(geometry, material);
  };

  private initThree = () => {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvasRef.nativeElement.clientWidth /
        this.canvasRef.nativeElement.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setSize(
      this.canvasRef.nativeElement.clientWidth,
      this.canvasRef.nativeElement.clientHeight
    );

    this.createCone();

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    if (this.cone) {
      this.scene.add(this.cone);
    }

    this.animate();
  };

  private animate = () => {
    requestAnimationFrame(() => this.animate());
    if (this.cone && this.scene && this.renderer && this.camera) {
      this.cone.rotation.x += 0.01;
      this.cone.rotation.y += 0.01;
      this.cone.rotation.z += 0.01;
      this.renderer.render(this.scene, this.camera);
    }
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
